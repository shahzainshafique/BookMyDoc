import React from 'react'

const StepCounter = () => {
  return (
   
<ol class="flex items-center justify-center text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm light:text-gray-400 sm:text-base light:bg-gray-800 light:border-gray-700 sm:p-4 sm:space-x-4 rtl:space-x-reverse">
    <li class="flex items-center text-blue-600 light:text-blue-500">
        <span class="flex items-center justify-center w-5 h-5 me-2 text-xs border border-blue-600 rounded-full shrink-0 light:border-blue-500">
            1
        </span>
        Personal <span class="hidden sm:inline-flex sm:ms-2">Info</span>
        <svg class="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 9 4-4-4-4M1 9l4-4-4-4"/>
        </svg>
    </li>
    <li class="flex items-center">
        <span class="flex items-center justify-center w-5 h-5 me-2 text-xs border border-gray-500 rounded-full shrink-0 light:border-gray-400">
            2
        </span>
        Account <span class="hidden sm:inline-flex sm:ms-2">Info</span>
        <svg class="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 9 4-4-4-4M1 9l4-4-4-4"/>
        </svg>
    </li>
    <li class="flex items-center">
        <span class="flex items-center justify-center w-5 h-5 me-2 text-xs border border-gray-500 rounded-full shrink-0 light:border-gray-400">
            3
        </span>
        Review
    </li>
</ol>


  )
}

export default StepCounter