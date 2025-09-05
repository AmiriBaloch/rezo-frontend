import React from 'react'
import { RiDownloadCloudFill } from 'react-icons/ri';

const DownloadBtn = () => {
  return (
    <div className="m-6 grid place-items-center">
      <a 
        href="#" 
        className="relative transition-transform duration-400 hover:rotate-[-4deg] hover:scale-110 group"
      >
        {/* Button Content */}
        <div className="
          relative bg-gradient-to-r from-primary to-secondary
          py-5 px-12 rounded-[4rem] border-3 border-black
          text-black flex items-center gap-2 overflow-hidden
        ">
          <span className="font-bold text-2xl relative z-[2]">Download</span>
          <RiDownloadCloudFill className="text-3xl relative z-[2]" />

          {/* Reflections */}
          <div className="
            absolute w-2 h-[120px] bg-white/30 rotate-30
            inset-0 top-0 left-[-180%] m-auto
            transition-left duration-600 ease-[cubic-bezier(.2,.5,.2,1.2)]
            group-hover:left-[120%]
            after:content-[''] after:w-[26px] after:h-full after:bg-white/30
            after:absolute after:top-[-1rem] after:left-[1.25rem]
          "></div>
          <div className="
            absolute w-2 h-[120px] bg-white/30 rotate-30
            inset-0 top-0 left-[-180%] m-auto
            transition-left duration-600 ease-[cubic-bezier(.2,.5,.2,1.2)]
            group-hover:left-[-70%]
            after:content-[''] after:w-[40px] after:h-full after:bg-white/30
            after:absolute after:top-[-1rem] after:left-[0.8rem]
          "></div>
        </div>

        {/* Decorative Elements */}
        <img 
          src="/Button/star.png" 
          alt="" 
          className="
            absolute w-5 top-[-14px] left-[-16px] rotate-48 scale-10
            opacity-0 transition-all duration-500
            group-hover:opacity-100 group-hover:scale-110
            group-hover:delay-100
          " 
        />
        <img 
          src="/Button/star.png" 
          alt="" 
          className="
            absolute w-10 right-[-10px] top-[-4px] rotate-[-48deg] scale-10
            opacity-0 transition-all duration-500
            group-hover:opacity-100 group-hover:scale-110
          " 
        />
        <img 
          src="/Button/circle.png" 
          alt="" 
          className="
            absolute w-2 top-[-8px] left-[58px] scale-10
            opacity-0 transition-all duration-500
            group-hover:opacity-100 group-hover:translate-y-[-8px] group-hover:scale-110
            group-hover:delay-100
          " 
        />
        <img 
          src="/Button/circle.png" 
          alt="" 
          className="
            absolute w-2 right-[34px] bottom-[-8px] scale-10
            opacity-0 transition-all duration-500
            group-hover:opacity-100 group-hover:translate-x-[-20px] group-hover:translate-y-[20px] group-hover:scale-110
          " 
        />
        <img 
          src="/Button/diamond.png" 
          alt="" 
          className="
            absolute w-[18px] top-[-18px] right-[62px] scale-10
            opacity-0 transition-all duration-500
            group-hover:opacity-100 group-hover:translate-y-[7px] group-hover:rotate-[-24deg] group-hover:scale-110
          " 
        />
        <img 
          src="/Button/triangle.png" 
          alt="" 
          className="
            absolute w-[30px] left-[15px] bottom-[-16px] rotate-[-48deg] scale-10
            opacity-0 transition-all duration-500
            group-hover:opacity-100 group-hover:rotate-[-12deg] group-hover:scale-110
          " 
        />
        
        {/* Shadow */}
        <div className="
          absolute w-full h-full left-0 top-0
          bg-gradient-to-r from-primary to-secondary
          py-5 px-12 rounded-[4rem] border-3 border-black
          z-[-1] transition-transform duration-300
          group-hover:translate-x-[-0.5rem] group-hover:translate-y-[0.5rem]
        "></div>
      </a>
    </div>
  )
}

export default DownloadBtn
