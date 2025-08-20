import React from 'react'
import { assets } from '../../assets/assets'

const Companies = () => {
  return (
    <div className="overflow-hidden w-full mt-0">
  <p className="text-base text-center text-gray-500">Trusted by learners from</p>

  <div className="relative flex w-full overflow-hidden mt-5 md:mt-10">
    <div className="animate-scrollX gap-15 md:gap-20 items-center flex">
      {/* First set */}
      <img src={assets.microsoft_logo} alt="microsoft logo" className="w-20 md:w-24 lg:w-28" />
      <img src={assets.walmart_logo} alt="walmart logo" className="w-20 md:w-24 lg:w-28" />
      <img src={assets.accenture_logo} alt="accenture logo" className="w-20 md:w-24 lg:w-28" />
      <img src={assets.adobe_logo} alt="adobe logo" className="w-20 md:w-24 lg:w-28" />
      <img src={assets.paypal_logo} alt="paypal logo" className="w-20 md:w-24 lg:w-28" />

      {/* Duplicate set for seamless loop */}
      <img src={assets.microsoft_logo} alt="microsoft logo" className="w-20 md:w-24 lg:w-28" />
      <img src={assets.walmart_logo} alt="walmart logo" className="w-20 md:w-24 lg:w-28" />
      <img src={assets.accenture_logo} alt="accenture logo" className="w-20 md:w-24 lg:w-28" />
      <img src={assets.adobe_logo} alt="adobe logo" className="w-20 md:w-24 lg:w-28" />
      <img src={assets.paypal_logo} alt="paypal logo" className="w-20 md:w-24 lg:w-28" />
    </div>
  </div>
</div>
  )
}

export default Companies