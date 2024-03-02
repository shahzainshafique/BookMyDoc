import React from 'react'
import StepCounter from './StepCounter'

const StepForm = () => {
  return (
    <section class="bg-gray-50 ">
      <div class="flex flex-col  my-5 px-6 py-8 mx-auto md:h-screen lg:py-0">
          <StepCounter/>
          <div className='flex flex-row mt-5 flex-wrap justify-center'> 
          <div class="w-full flex flex-row space-x-9  bg-white rounded-lg shadow light:border md:mt-0 sm:max-w-md xl:p-0 light:bg-gray-800 light:border-gray-700">
              <div class="w-full p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl light:text-white">
                      Please enter personal details
                  </h1>
                  <form class="space-y-4 md:space-y-6" action="#">
                    <div className="flex flex-row space-x-12">
                    <div className="flex flex-col">
                      <div>
                          <label for="email" class="block mb-2 text-sm font-medium text-gray-900 light:text-white">Your email</label>
                          <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500" placeholder="name@company.com" required=""/>
                      </div>
                      <div>
                          <label for="password" class="block mb-2 text-sm font-medium text-gray-900 light:text-white">Password</label>
                          <input type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500" required=""/>
                      </div>
                      <div>
                          <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 light:text-white">Confirm password</label>
                          <input type="confirm-password" name="confirm-password" id="confirm-password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500" required=""/>
                      </div>
                      </div>
                     <div className='flex flex-col'>
                      <div>
                          <label for="email" class="block mb-2 text-sm font-medium text-gray-900 light:text-white">Your email</label>
                          <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500" placeholder="name@company.com" required=""/>
                      </div>
                      <div>
                          <label for="password" class="block mb-2 text-sm font-medium text-gray-900 light:text-white">Password</label>
                          <input type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500" required=""/>
                      </div>
                      <div>
                          <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 light:text-white">Confirm password</label>
                          <input type="confirm-password" name="confirm-password" id="confirm-password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500" required=""/>
                      </div>
                      </div>
                      </div>
                      <div class="flex items-start">
                          <div class="flex items-center h-5">
                            <input id="terms" aria-describedby="terms" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 light:bg-gray-700 light:border-gray-600 light:focus:ring-primary-600 light:ring-offset-gray-800" required=""/>
                          </div>
                          <div class="ml-3 text-sm">
                            <label for="terms" class="font-light text-gray-500 light:text-gray-300">I accept the <a class="font-medium text-primary-600 hover:underline light:text-primary-500" href="#">Terms and Conditions</a></label>
                          </div>
                      </div>
                      <button type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center light:bg-primary-600 light:hover:bg-primary-700 light:focus:ring-primary-800">Create an account</button>
                      <p class="text-sm font-light text-gray-500 light:text-gray-400">
                          Already have an account? <a href="#" class="font-medium text-primary-600 hover:underline light:text-primary-500">Login here</a>
                      </p>
                  </form>
              </div>
             
          </div>
          
          
      </div>
      </div>
    </section>
  )
}

export default StepForm