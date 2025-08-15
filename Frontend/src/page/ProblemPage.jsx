import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from "../utils/axiosClient"
import SubmissionHistory from "../components/SubmissionHistory"
import { useSelector } from 'react-redux';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
const langMap = {
  cpp: 'c++',
  java: 'java',
  javascript: 'javaScript'
};


const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const [editor_theme, set_editor_theme] = useState('vs-dark')
  const { user } = useSelector((state) => state.auth);
  const editorRef = useRef(null);
  let { problemId } = useParams();


  const { handleSubmit } = useForm();

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {

        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        const initialcode = response.data.StartCode.find(sc => sc.language === langMap[selectedLanguage]).initialcode;
        setProblem(response.data);
        setCode(initialcode);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching problem:', error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);
  useEffect(() => {
    if (problem) {
      const initialcode = problem.StartCode.find(sc => sc.language === langMap[selectedLanguage]).initialcode;
      setCode(initialcode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    console.log(language + "language");

  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);

    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage
      });

      setRunResult(response.data);
      setLoading(false);
      setActiveRightTab('testcase');

    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: 'Internal server error'
      });
      setLoading(false);
      setActiveRightTab('testcase');
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);

    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code: code,
        language: selectedLanguage
      });
      setSubmitResult(response.data);
      setLoading(false);
      setActiveRightTab('result');

    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult(null);
      setLoading(false);
      setActiveRightTab('result');
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-base-100 ">
      {/* Left Panel */}
      <div className="w-1/2 flex flex-col border-r border-base-300">
        {/* Left Tabs */}
        <div className="tabs tabs-bordered bg-base-200 px-4">
          <button
            className={`tab ${activeLeftTab === 'description' ? 'tab-active' : ''}`}
            onClick={() => setActiveLeftTab('description')}
          >
            Description
          </button>
          <button
            className={`tab ${activeLeftTab === 'editorial' ? 'tab-active' : ''}`}
            onClick={() => setActiveLeftTab('editorial')}
          >
            Editorial
          </button>
          <button
            className={`tab ${activeLeftTab === 'solutions' ? 'tab-active' : ''}`}
            onClick={() => setActiveLeftTab('solutions')}
          >
            Solutions
          </button>
          <button
            className={`tab ${activeLeftTab === 'submissions' ? 'tab-active' : ''}`}
            onClick={() => setActiveLeftTab('submissions')}
          >
            Submissions
          </button>
        </div>

        {/* Left Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {problem && (
            <>
              {activeLeftTab === 'description' && (
                <div>
                  <h1 className="text-2xl font-bold">{problem.title}</h1>
                  <div className="flex items-center gap-4 my-3">

                    <div className={`badge badge-outline ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </div>
                    <div className="badge badge-outline uppercase" >{problem.tags}</div>
                  </div>

                  <div className="prose max-w-none">
                    <p>Discription:-</p>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {problem.description}
                    </div>
                  </div>

                  <div className="mt-4 ">
                    <h3 className="text-lg font-semibold mb-4">Examples:</h3>
                    <div className="space-y-4">
                      {problem.visibletestcases.map((example, index) => (
                        <div key={index} className="bg-base-300 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Example {index + 1}:</h4>
                          <div className="space-y-2 text-sm font-mono">
                            <div><strong>Input:</strong> {example.input}</div>
                            <div><strong>Output:</strong> {example.output}</div>
                            <div><strong>Explanation:</strong> {example.explanation}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeLeftTab === 'editorial' && (
                <div className="prose max-w-none">
                  <h2 className="text-xl font-bold mb-4">Editorial</h2>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {'Editorial is here for the problem'}
                  </div>
                </div>
              )}

              {activeLeftTab === 'solutions' && (
                user?.plans === "premium" ? (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Solutions</h2>
                    <div className="space-y-6">
                      {problem.referenceSolution?.length > 0 ? (
                        problem.referenceSolution.map((solution, index) => (
                          <div key={index} className="border border-base-300 rounded-lg">
                            <div className="bg-base-200 px-4 py-2 rounded-t-lg">
                              <h3 className="font-semibold">
                                {problem?.title} - {solution?.language}
                              </h3>
                            </div>
                            <div className="p-4">
                              <pre className="bg-base-300 p-4 rounded text-sm overflow-x-auto">
                                <code>{solution?.completeCode}</code>
                              </pre>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">
                          "Get a subscription to view solutions."
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p>This will be available for only the premium user</p>
                )
              )}

              {activeLeftTab === 'submissions' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">My Submissions</h2>
                  <div className="text-gray-500">
                    <SubmissionHistory problemId={problemId} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col">
        {/* Right Tabs */}
        <div className="tabs tabs-bordered bg-base-200 px-4">
          <button
            className={`tab ${activeRightTab === 'code' ? 'tab-active' : ''}`}
            onClick={() => setActiveRightTab('code')}
          >
            Code
          </button>
          <button
            className={`tab ${activeRightTab === 'testcase' ? 'tab-active' : ''}`}
            onClick={() => setActiveRightTab('testcase')}
          >
            Testcase
          </button>
          <button
            className={`tab ${activeRightTab === 'result' ? 'tab-active' : ''}`}
            onClick={() => setActiveRightTab('result')}
          >
            Result
          </button>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col">
          {activeRightTab === 'code' && (
            <div className="flex-1 flex flex-col">
              {/* Language Selector */}
              <div className="flex items-center justify-between px-4 py-3 bg-base-100 border-b border-gray-700">
                <div className="flex gap-3">
                  {/* Language buttons */}
                  {['javascript', 'java', 'cpp'].map((lang) => (
                    <button
                      key={lang}
                      className={`btn btn-sm capitalize transition-colors duration-200 ${selectedLanguage === lang ? 'btn-primary' : 'btn-ghost text-gray-300 hover:text-white'
                        }`}
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {lang === 'cpp' ? 'C++' : lang}
                    </button>
                  ))}
                </div>

                {/* Theme selector */}
                <select
                  name="editor_theme"
                  id="editor_theme_id"
                  className="p-2 text-sm bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                  onChange={(e) => set_editor_theme(e.target.value)}
                >
                  <option value="vs-dark">Dark</option>
                  <option value="vs-light">Light</option>
                  <option value="hc-black">High Contrast</option>
                </select>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1">
                <Editor
                  height="100%"
                  language={getLanguageForMonaco(selectedLanguage)}
                  value={code}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme={editor_theme}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    glyphMargin: false,
                    folding: true,
                    lineDecorationsWidth: 10,
                    lineNumbersMinChars: 3,
                    renderLineHighlight: 'line',
                    selectOnLineNumbers: true,
                    roundedSelection: false,
                    readOnly: false,
                    cursorStyle: 'line',
                    mouseWheelZoom: true,
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-base-300 flex justify-between">
                <div className="flex gap-2">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setActiveRightTab('testcase')}
                  >
                    Console
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    className={`btn btn-outline btn-sm ${loading ? 'loading' : ''}`}
                    onClick={handleRun}
                    disabled={loading}
                  >
                    Run
                  </button>
                  <button
                    className={`btn btn-primary btn-sm ${loading ? 'loading' : ''}`}
                    onClick={handleSubmitCode}
                    disabled={loading}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeRightTab === 'testcase' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4">Test Results</h3>
              {runResult ? (
                <div className={`alert ${runResult.success ? 'alert-success' : 'alert-error'} mb-4`}>
                  <div>
                    {runResult.success ? (
                      <div className=''>
                        <h4 className="font-bold">✅ All Test Cases Passed!</h4>
                        <p className="text-sm mt-2">Runtime: {runResult.runtime + " sec"}</p>
                        <p className="text-sm">Memory: {runResult.memory + " KB"}</p>

                        <div className="mt-4 space-y-2">
                          {runResult.testCases.map((tc, i) => (
                            <div key={i} className="bg-base-100 p-3 rounded text-xs">
                              <div className="font-mono">
                                <div className='text-white'><strong >Input:</strong> {tc.stdin}</div>
                                <div className='text-white'><strong>Expected:</strong> {tc.expected_output}</div>
                                <div className='text-white'><strong>Output:</strong> {tc.stdout}</div>
                                <div className={'text-green-300 font-semibold'}>
                                  {'✓ Passed'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <h2 className='font-bold mt-2 underline'>Testing Code</h2>
                        <SyntaxHighlighter
                          language="javascript"
                          style={vscDarkPlus}
                          wrapLongLines={true}
                        >
                          {runResult.testCases[0].source_code}
                        </SyntaxHighlighter>

                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold">❌ Error</h4>
                        <div className="mt-4 space-y-2">
                          {runResult.testCases.map((tc, i) => (
                            <div key={i} className="bg-base-100 p-3 rounded text-xs">
                              <div className="font-mono">
                                <div><strong>Input:</strong> {tc.stdin}</div>
                                <div><strong>Expected:</strong> {tc.expected_output}</div>
                                <div><strong>Output:</strong> {tc.stdout}</div>
                                <div className={tc.status_id == 3 ? 'text-green-600' : 'text-red-600'}>
                                  {tc.status_id == 3 ? '✓ Passed' : '✗ Failed'}
                                </div>
                                {/* <div>{}</div> */}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">
                  Click "Run" to test your code with the example test cases.
                </div>
              )}
            </div>
          )}

          {activeRightTab === 'result' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4">Submission Result</h3>
              {submitResult ? (
                <div className={`alert ${submitResult.accepted === true
                  ? 'alert-success'
                  : submitResult.accepted === false
                    ? 'alert-error'
                    : 'alert-info'
                  }`}>
                  <div>
                    {submitResult.accepted ? (
                      <div>
                        <div>
                          <div className='flex'>
                            {user?.firstName} submitted at {new Date().toLocaleString()}
                          </div>
                          <h4 className="font-bold text-black text-lg">🎉 Accepted</h4>
                          <div className="mt-4 space-y-2">
                            <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.testCasesTotal}</p>
                            <p>Runtime: {submitResult.runtime + " Second"}</p>
                            <p>Memory: {submitResult.memory + " KB"} </p>
                          </div>
                        </div>
                        <h2 className='font-bold mt-2 underline'>Submitted Code</h2>
                        <SyntaxHighlighter
                          language="javascript"
                          style={vscDarkPlus}
                          wrapLongLines={true}
                        >
                          {submitResult.source_code}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold text-lg">❌ {submitResult.error}</h4>
                        <div className="mt-4 space-y-2">
                          <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">
                  Click "Submit" to submit your solution for evaluation.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;

