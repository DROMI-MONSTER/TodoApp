import React from 'react'
import { z } from 'zod'
import { useForm } from "react-hook-form"

function SignUpCompo() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const onSubmit = (data) => console.log(data)

    console.log(watch("example"))

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input placeholder={"Enter Your Name"}  {...register("name")} />
                <input type="submit" value={"SignUp"} />
            </form>
        </div>
    )
}

export default SignUpCompo