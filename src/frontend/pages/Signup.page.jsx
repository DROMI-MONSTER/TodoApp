import React from 'react'
import SignUp from '../assets/SignUp.png'
import SignUpCompo from '../components/SignUp.component'
function Signup() {
    return (
        <div
            className='border-3 border-[#9a600c] bg-[#fef0e0] w-4/5 h-4/5 rounded flex justify-between items-center overflow-hidden'
        >
            <div className='overflow-hidden w-1/2'>
                <img
                    src={SignUp} alt="Sign Up"
                    className='h-full w-full'
                />
            </div>
            <div>
                <SignUpCompo/>
            </div>
        </div>
    )
}

export default Signup