const StepCounter = ({ currentStep,setFormStep }) => {
    return (
      <ol className="flex items-center justify-center text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm light:text-gray-400 sm:text-base light:bg-gray-800 light:border-gray-700 sm:p-4 sm:space-x-4 rtl:space-x-reverse">
        <li onClick={()=>setFormStep(1)} className={`flex items-center ${currentStep === 1 ? 'text-blue-600 light:text-blue-500' : 'text-black'}`}>
          <span className={`flex items-center justify-center w-5 h-5 me-2 text-xs border ${currentStep === 1 ? 'border-blue-600' :'border-black'} rounded-full shrink-0 light:border-blue-500"`}>
            1
          </span>
          Personal <span className="hidden sm:inline-flex sm:ms-2">Info</span>
          <svg className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7 9 4-4-4-4M1 9l4-4-4-4"/></svg>
        </li>
        <li onClick={()=>setFormStep(2)} className={`flex items-center ${currentStep === 2 ? 'text-blue-600 light:text-blue-500' : 'text-black'}`}>
        <span className={`flex items-center justify-center w-5 h-5 me-2 text-xs border ${currentStep === 2 ? 'border-blue-600' :'border-black'} rounded-full shrink-0 light:border-blue-500"`}>
            2
          </span>
          Account <span className="hidden sm:inline-flex sm:ms-2">Info</span>
         <svg className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7 9 4-4-4-4M1 9l4-4-4-4"/></svg>
        </li>
        <li onClick={()=>setFormStep(3)} className={`flex items-center ${currentStep === 3 ? 'text-blue-600 light:text-blue-500' : ''}`}>
        <span className={`flex items-center justify-center w-5 h-5 me-2 text-xs border ${currentStep === 3 ? 'border-blue-600' :'border-black'} rounded-full shrink-0 light:border-blue-500"`}>
            3
          </span>
          Review
        </li>
      </ol>
    );
  };
  
  export default StepCounter;
  