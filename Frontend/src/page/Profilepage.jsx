// import { useSelector } from 'react-redux';
// import { NavLink } from 'react-router'
// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import axiosClient from '../utils/axiosClient';
// const profileUpdateSchema = z.object({
//     firstName: z
//         .string()
//         .min(3, "First name must be at least 3 characters")
//         .nonempty("First name is required"),

//     lastName: z
//         .string()
//         .min(3, "Last name must be at least 3 characters")
//         .nonempty("Last name is required"),

//     emailId: z
//         .string()
//         .email("Enter a valid email")
//         .nonempty("Email is required"),

//     age: z
//         .coerce
//         .number()
//         .min(6, "Too young")
//         .max(80, "Too old")
//         .refine(val => !isNaN(val), { message: "Age is required" }),

//     role: z
//         .enum(["user", "admin"], { required_error: "Role is required" }),

//     old_password: z
//         .string()
//         .min(8, "Old password must be at least 8 characters")
//         .regex(/[A-Z]/, "Must contain at least one uppercase letter")
//         .regex(/[a-z]/, "Must contain at least one lowercase letter")
//         .regex(/[^A-Za-z0-9]/, "Must contain at least one special character")
//         .nonempty("Old password is required"),

//     new_password: z
//         .string()
//         .min(8, "New password must be at least 8 characters")
//         .regex(/[A-Z]/, "Must contain at least one uppercase letter")
//         .regex(/[a-z]/, "Must contain at least one lowercase letter")
//         .regex(/[^A-Za-z0-9]/, "Must contain at least one special character")
//         .nonempty("New password is required"),

//     photo: z
//         .any()
//         .refine((file) => file?.[0], { message: "Photo is required" }),
// });




// const Profilepage = () => {
//     const user = useSelector((state) => state.auth.user);
//     console.log('user');

//     console.log(user);

//     const [showOldPassword, setShowOldPassword] = useState(false);
//     const [showNewPassword, setShowNewPassword] = useState(false);
//     const {
//         register,
//         handleSubmit,
//         reset,
//         formState: { errors, isSubmitting }
//     } = useForm({
//         resolver: zodResolver(profileUpdateSchema),
//         defaultValues: {
//             firstName: user?.firstName || "",
//             lastName: user?.lastName || "",
//             emailId: user?.emailId || "",
//             age: user?.age || "",
//             role: user?.role || "user",
//             old_password: "",
//             new_password: ""
//         }
//     });

//     // const onSubmit = async (data) => {
//     //     console.log("Form data submitted:", data);

//     //     try {
//     //         const formData = new FormData();
//     //         formData.append("id", user.id);
//     //         formData.append("firstName", data.firstName);
//     //         formData.append("lastName", data.lastName);
//     //         formData.append("age", data.age);
//     //         formData.append("emailId", data.emailId);
//     //         formData.append("old_password", data.old_password);
//     //         formData.append("new_password", data.new_password);
//     //         console.log('formdata');

//     //         console.log(formData);

//     //         // file handling
//     //         if (data.photo && data.photo[0]) {
//     //             formData.append("photo", data.photo[0]);
//     //         }

//     //         console.log("formData entries:");
//     //         for (let [key, value] of formData.entries()) {
//     //             console.log(key, value);
//     //         }

//     //         const res = await axiosClient.put("/user/profileupdate", formData, {
//     //             headers: {
//     //                 "Content-Type": "multipart/form-data",
//     //             },
//     //         });
//     //         console.log(res);


//     //         console.log("response:", res);
//     //         alert(res.data.message || "Profile updated successfully!");
//     //         reset();
//     //     } catch (error) {
//     //         console.error(error.response?.data || error.message);
//     //         alert(error.response?.data?.message || "Update failed");
//     //     }
//     // };
//     const onSubmit = async (data) => {
//         console.log("data", data);

//         try {
//             const formData = new FormData();
//             formData.append("id", user._id);
//             formData.append("firstName", data.firstName);
//             formData.append("lastName", data.lastName);
//             formData.append("age", data.age);
//             formData.append("emailId", data.emailId);
//             formData.append("old_password", data.old_password);
//             formData.append("new_password", data.new_password);
//             formData.append("photo", data.photo[0]); // ✅ file comes from input

//             console.log("form data entries:");
//             for (let pair of formData.entries()) {
//                 console.log(pair[0], pair[1]);
//             }

//             const res = await axiosClient.put("/user/profileupdate", formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });

//             console.log("response", res);
//             alert(res.data.message || "Profile updated successfully!");
//             reset();
//         } catch (error) {
//             console.error(error.response?.data || error.message);
//             alert(error.response?.data?.message || "Update failed");
//         }
//     };
//     return (
//         <div>
//             <div className="flex items-center justify-between px-6 py-4 bg-black/20 shadow-md rounded-xl mb-6 w-full flex-wrap gap-y-4">
//                 <NavLink
//                     to="/"
//                     className="text-base font-semibold uppercase text-gray-100 hover:text-blue-600 hover:underline transition"
//                 >
//                     Home
//                 </NavLink>

//                 <h1 className="text-xl md:text-2xl font-bold uppercase text-gray-100">
//                     Update Profile
//                 </h1>
//                 {/* Right Section - User Info */}
//                 <div className="text-right hidden sm:block">
//                     <h2 className="text-md md:text-lg font-semibold text-gray-100">
//                         Welcome, <span className="uppercase text-blue-600">{user?.firstName || 'Admin'}</span>
//                     </h2>
//                     <p className="text-sm text-gray-100">{user?.emailId || ' '}</p>
//                 </div>
//             </div>
//             <div className='w-full flex justify-center items-center'>
//                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-[98%]">
//                     <div className="w-full">
//                         <label
//                             htmlFor="photo"
//                             className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 transition"
//                         >
//                             <span className="text-gray-600 dark:text-gray-300">
//                                 📷 Click to upload photo
//                             </span>
//                             <input
//                                 id="photo"
//                                 type="file"
//                                 accept="image/*"
//                                 {...register("photo")}
//                                 className="hidden"
//                             />
//                         </label>
//                     </div>

//                     {/* First Name */}
//                     <div>
//                         <div>
//                             <div>
//                                 <label htmlFor="userfirstname" className="block mb-1">First Name</label>
//                                 <input
//                                     id='userfirstname'
//                                     {...register("firstName")}
//                                     className="input input-bordered w-full bg-gray-800 border-gray-700"
//                                 />
//                                 {errors.firstName && (
//                                     <p className="text-red-500 text-sm">{errors.firstName.message}</p>
//                                 )}
//                             </div>

//                             {/* Last Name */}
//                             <div>
//                                 <label htmlFor="userlasrname" className="block mb-1">Last Name</label>
//                                 <input
//                                     id='userlasrname'
//                                     {...register("lastName")}
//                                     className="input input-bordered w-full bg-gray-800 border-gray-700"
//                                 />
//                                 {errors.lastName && (
//                                     <p className="text-red-500 text-sm">{errors.lastName.message}</p>
//                                 )}
//                             </div>
//                         </div>
//                         <div>
//                             <img src="" alt="" />
//                         </div>
//                     </div>
//                     {/* Email (read-only) */}
//                     <div>
//                         <label htmlFor="useremail" className="block mb-1">Email</label>
//                         <input
//                             id='useremail'
//                             {...register("emailId")}
//                             readOnly
//                             className="input input-bordered w-full bg-gray-800 border-gray-700 opacity-50 cursor-not-allowed"
//                         />
//                         {errors.emailId && (
//                             <p className="text-red-500 text-sm">{errors.emailId.message}</p>
//                         )}
//                     </div>

//                     {/* Age */}
//                     <div>
//                         <label htmlFor="userage" className="block mb-1">Age</label>
//                         <input
//                             id='userage'
//                             type="number"
//                             {...register("age")}
//                             className="input input-bordered w-full bg-gray-800 border-gray-700"
//                         />
//                         {errors.age && (
//                             <p className="text-red-500 text-sm">{errors.age.message}</p>
//                         )}
//                     </div>

//                     {/* Role (read-only) */}
//                     <div>
//                         <label htmlFor="userrole" className="block mb-1">Role</label>
//                         <input
//                             id='userrole'
//                             {...register("role")}
//                             readOnly
//                             className="input input-bordered w-full bg-gray-800 border-gray-700 opacity-50 cursor-not-allowed"
//                         />
//                     </div>

//                     {/* Old Password */}
//                     <div>
//                         {/* <label htmlFor=""></label> */}
//                         <label htmlFor="old_password" className="block mb-1">Old Password</label>
//                         <div className="relative">
//                             <input
//                                 id='old_password'
//                                 type={showOldPassword ? "text" : "password"}
//                                 {...register("old_password")}
//                                 className="input input-bordered w-full bg-gray-800 border-gray-700 pr-10"
//                             />
//                             <button
//                                 type="button"
//                                 onClick={() => setShowOldPassword(!showOldPassword)}
//                                 className="absolute right-3 top-2 text-gray-400"
//                             >
//                                 {/* {showOldPassword ? "🙈" : "👁️"} */}
//                                 {showOldPassword ? (
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
//                                         viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                             d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 
//                     0-8.268-2.943-9.543-7a9.97 9.97 0 
//                     011.563-3.029m5.858.908a3 3 0 
//                     114.243 4.243M9.878 9.878l4.242 
//                     4.242M3 3l3.59 3.59m0 0A9.953 
//                     9.953 0 0112 5c4.478 0 8.268 
//                     2.943 9.543 7a10.025 10.025 0 
//                     01-4.132 5.411L21 21" />
//                                     </svg>
//                                 ) : (
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
//                                         viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                             d="M15 12a3 3 0 11-6 0 3 3 
//                     0 016 0z" />
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                             d="M2.458 12C3.732 7.943 7.523 
//                        5 12 5c4.478 0 8.268 2.943 
//                        9.542 7-1.274 4.057-5.064 
//                        7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                                     </svg>
//                                 )}
//                             </button>
//                         </div>
//                         {errors.old_password && (
//                             <p className="text-red-500 text-sm">{errors.old_password.message}</p>
//                         )}
//                     </div>

//                     {/* New Password */}
//                     <div>
//                         <label htmlFor='usernewpassword' className="block mb-1">New Password</label>
//                         <div className="relative">
//                             <input
//                                 id='usernewpassword'
//                                 type={showNewPassword ? "text" : "password"}
//                                 {...register("new_password")}
//                                 className="input input-bordered w-full bg-gray-800 border-gray-700 pr-10"
//                             />
//                             <button
//                                 type="button"
//                                 onClick={() => setShowNewPassword(!showNewPassword)}
//                                 className="absolute right-3 top-2 text-gray-400"
//                             >
//                                 {/* {showNewPassword ? "🙈" : "👁️"} */}
//                                 {showNewPassword ? (
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
//                                         viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                             d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 
//                     0-8.268-2.943-9.543-7a9.97 9.97 0 
//                     011.563-3.029m5.858.908a3 3 0 
//                     114.243 4.243M9.878 9.878l4.242 
//                     4.242M3 3l3.59 3.59m0 0A9.953 
//                     9.953 0 0112 5c4.478 0 8.268 
//                     2.943 9.543 7a10.025 10.025 0 
//                     01-4.132 5.411L21 21" />
//                                     </svg>
//                                 ) : (
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
//                                         viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                             d="M15 12a3 3 0 11-6 0 3 3 
//                     0 016 0z" />
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                             d="M2.458 12C3.732 7.943 7.523 
//                        5 12 5c4.478 0 8.268 2.943 
//                        9.542 7-1.274 4.057-5.064 
//                        7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                                     </svg>
//                                 )}
//                             </button>
//                         </div>
//                         {errors.new_password && (
//                             <p className="text-red-500 text-sm">{errors.new_password.message}</p>
//                         )}
//                     </div>

//                     {/* Submit */}
//                     <div className='flex justify-between mb-6'>
//                         <button
//                             type="submit"
//                             disabled={isSubmitting}
//                             className="btn btn-primary w-[49%]"
//                         >
//                             {isSubmitting ? "Updating..." : "Update Profile"}
//                         </button>
//                         <button
//                             type="button"
//                             className="btn btn-primary w-[49%]"
//                             onClick={() =>
//                                 reset({
//                                     firstName: user?.firstName || "",
//                                     lastName: "",
//                                     emailId: user?.emailId || "",
//                                     age: "",
//                                     role: user?.role || "user",
//                                     old_password: "",
//                                     new_password: ""
//                                 })
//                             }
//                         >
//                             Reset
//                         </button>

//                     </div>
//                 </form>

//             </div>

//         </div>
//     )
// }
// export default Profilepage
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router'
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
const profileUpdateSchema = z.object({
    firstName: z
        .string()
        .min(3, "First name must be at least 3 characters")
        .nonempty("First name is required"),

    lastName: z
        .string()
        .min(3, "Last name must be at least 3 characters")
        .nonempty("Last name is required"),

    emailId: z
        .string()
        .email("Enter a valid email")
        .nonempty("Email is required"),

    age: z
        .coerce
        .number()
        .min(6, "Too young")
        .max(80, "Too old")
        .refine(val => !isNaN(val), { message: "Age is required" }),

    role: z
        .enum(["user", "admin"], { required_error: "Role is required" }),

    old_password: z
        .string()
        .min(8, "Old password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[^A-Za-z0-9]/, "Must contain at least one special character")
        .nonempty("Old password is required"),

    new_password: z
        .string()
        .min(8, "New password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[^A-Za-z0-9]/, "Must contain at least one special character")
        .nonempty("New password is required"),

    photo: z
        .any()
        .refine((file) => file?.[0], { message: "Photo is required" }),
});




const Profilepage = () => {
    const user = useSelector((state) => state.auth.user);
    console.log('user');

    console.log(user);

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [preview, setPreview] = useState(null);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(profileUpdateSchema),
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            emailId: user?.emailId || "",
            age: user?.age || "",
            role: user?.role || "user",
            old_password: "",
            new_password: ""
        }
    });

    const onSubmit = async (data) => {
        console.log("data", data);

        try {
            const formData = new FormData();
            formData.append("id", user._id);
            formData.append("firstName", data.firstName);
            formData.append("lastName", data.lastName);
            formData.append("age", data.age);
            formData.append("emailId", data.emailId);
            formData.append("old_password", data.old_password);
            formData.append("new_password", data.new_password);
            formData.append("photo", data.photo[0]); // ✅ file comes from input

            console.log("form data entries:");
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            const res = await axiosClient.put("/user/profileupdate", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("response", res);
            alert(res.data.message || "Profile updated successfully!");
            reset();
        } catch (error) {
            console.error(error.response?.data || error.message);
            alert(error.response?.data?.message || "Update failed");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file)); // create local preview
        }
    };
    return (
        <div>
            <div className="flex items-center justify-between px-6 py-4 bg-black/20 shadow-md rounded-xl mb-6 w-full flex-wrap gap-y-4">
                <NavLink
                    to="/"
                    className="text-base font-semibold uppercase text-gray-100 hover:text-blue-600 hover:underline transition"
                >
                    Home
                </NavLink>

                <h1 className="text-xl md:text-2xl font-bold uppercase text-gray-100">
                    Update Profile
                </h1>
                {/* Right Section - User Info */}
                <div className="text-right hidden sm:block">
                    <h2 className="text-md md:text-lg font-semibold text-gray-100">
                        Welcome, <span className="uppercase text-blue-600">{user?.firstName || 'Admin'}</span>
                    </h2>
                    <p className="text-sm text-gray-100">{user?.emailId || ' '}</p>
                </div>
            </div>
            <div className='w-full flex justify-center items-center'>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-[98%]">
                    {/* <div className="w-full">
                        <label
                            htmlFor="photo"
                            className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 transition"
                        >
                            <span className="text-gray-600 dark:text-gray-300">
                                📷 Click to upload photo
                            </span>
                            <input
                                id="photo"
                                type="file"
                                accept="image/*"
                                {...register("photo")}
                                className="hidden"
                            />
                        </label>
                    </div> */}

                    <div className='flex  items-center justify-between'>
                        <div className='w-[80%] space-y-4'>
                            {/* First Name */}
                            <div>
                                <label htmlFor="userfirstname" className="block mb-1">First Name</label>
                                <input
                                    id='userfirstname'
                                    {...register("firstName")}
                                    className="input input-bordered w-full bg-gray-800 border-gray-700"
                                />
                                {errors.firstName && (
                                    <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div>
                                <label htmlFor="userlasrname" className="block mb-1">Last Name</label>
                                <input
                                    id='userlasrname'
                                    {...register("lastName")}
                                    className="input input-bordered w-full bg-gray-800 border-gray-700"
                                />
                                {errors.lastName && (
                                    <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                                )}
                            </div>
                            {/* {age} */}
                            <div>
                                <label htmlFor="userage" className="block mb-1">Age</label>
                                <input
                                    id='userage'
                                    type="number"
                                    {...register("age")}
                                    className="input input-bordered w-full bg-gray-800 border-gray-700"
                                />
                                {errors.age && (
                                    <p className="text-red-500 text-sm">{errors.age.message}</p>
                                )}
                            </div>
                        </div>
                        <div className='flex flex-col justify-center items-center w-[15%]'>
                            <div className="w-full h-full flex flex-col gap-2 mt-4">
                                {/* Preview section */}
                                {preview ? (
                                    <div className="flex justify-center">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="object-cover shadow-md border"
                                        />
                                    </div>
                                ) : (
                                    <div className='h-[30vh] w-[100%] border rounded-2xl'>
                                        <img src={user?.photo || 'https://res.cloudinary.com/dkbowuecy/image/upload/v1755334396/face-scan_mb6ypq.png'} alt="img" className='h-full w-full object-center rounded-2xl ' />
                                    </div>
                                )}
                                {/* Upload box */}
                                <label
                                    htmlFor="photo"
                                    className="flex items-center justify-center w-full p-0.5 border-2 border-dashed rounded cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 transition"
                                >
                                    <span className="text-gray-600 dark:text-gray-300">
                                        Upload photo
                                    </span>
                                    <input
                                        id="photo"
                                        type="file"
                                        accept="image/*"
                                        {...register("photo")}
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>


                            </div>
                        </div>
                    </div>



                    {/* Email (read-only) */}
                    <div>
                        <label htmlFor="useremail" className="block mb-1">Email</label>
                        <input
                            id='useremail'
                            {...register("emailId")}
                            readOnly
                            className="input input-bordered w-full bg-gray-800 border-gray-700 opacity-50 cursor-not-allowed"
                        />
                        {errors.emailId && (
                            <p className="text-red-500 text-sm">{errors.emailId.message}</p>
                        )}
                    </div>

                    {/* Role (read-only) */}
                    <div>
                        <label htmlFor="userrole" className="block mb-1">Role</label>
                        <input
                            id='userrole'
                            {...register("role")}
                            readOnly
                            className="input input-bordered w-full bg-gray-800 border-gray-700 opacity-50 cursor-not-allowed"
                        />
                    </div>

                    {/* Old Password */}
                    <div>
                        {/* <label htmlFor=""></label> */}
                        <label htmlFor="old_password" className="block mb-1">Old Password</label>
                        <div className="relative">
                            <input
                                id='old_password'
                                type={showOldPassword ? "text" : "password"}
                                {...register("old_password")}
                                className="input input-bordered w-full bg-gray-800 border-gray-700 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                className="absolute right-3 top-2 text-gray-400"
                            >
                                {/* {showOldPassword ? "🙈" : "👁️"} */}
                                {showOldPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 
                    0-8.268-2.943-9.543-7a9.97 9.97 0 
                    011.563-3.029m5.858.908a3 3 0 
                    114.243 4.243M9.878 9.878l4.242 
                    4.242M3 3l3.59 3.59m0 0A9.953 
                    9.953 0 0112 5c4.478 0 8.268 
                    2.943 9.543 7a10.025 10.025 0 
                    01-4.132 5.411L21 21" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 
                    0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 
                       5 12 5c4.478 0 8.268 2.943 
                       9.542 7-1.274 4.057-5.064 
                       7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.old_password && (
                            <p className="text-red-500 text-sm">{errors.old_password.message}</p>
                        )}
                    </div>

                    {/* New Password */}
                    <div>
                        <label htmlFor='usernewpassword' className="block mb-1">New Password</label>
                        <div className="relative">
                            <input
                                id='usernewpassword'
                                type={showNewPassword ? "text" : "password"}
                                {...register("new_password")}
                                className="input input-bordered w-full bg-gray-800 border-gray-700 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-2 text-gray-400"
                            >
                                {/* {showNewPassword ? "🙈" : "👁️"} */}
                                {showNewPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 
                    0-8.268-2.943-9.543-7a9.97 9.97 0 
                    011.563-3.029m5.858.908a3 3 0 
                    114.243 4.243M9.878 9.878l4.242 
                    4.242M3 3l3.59 3.59m0 0A9.953 
                    9.953 0 0112 5c4.478 0 8.268 
                    2.943 9.543 7a10.025 10.025 0 
                    01-4.132 5.411L21 21" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 
                    0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 
                       5 12 5c4.478 0 8.268 2.943 
                       9.542 7-1.274 4.057-5.064 
                       7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.new_password && (
                            <p className="text-red-500 text-sm">{errors.new_password.message}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <div className='flex justify-between mb-6'>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary w-[49%]"
                        >
                            {isSubmitting ? "Updating..." : "Update Profile"}
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary w-[49%]"
                            onClick={() =>
                                reset({
                                    firstName: user?.firstName || "",
                                    lastName: "",
                                    emailId: user?.emailId || "",
                                    age: "",
                                    role: user?.role || "user",
                                    old_password: "",
                                    new_password: ""
                                })
                            }
                        >
                            Reset
                        </button>

                    </div>
                </form>

            </div>

        </div>
    )
}
export default Profilepage