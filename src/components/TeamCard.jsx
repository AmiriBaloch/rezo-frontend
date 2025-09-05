import Link from "next/link";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaLinkedin,
} from "react-icons/fa6";

export default function TeamCard({ title, role, imageClass, social }) {
  return (
    <div
      className={`md:w-[18%] hover:w-full duration-[2000ms] h-[40vh] hover:mx-2 mx-1 rounded-3xl bg-cover ${imageClass} cursor-pointer`}
    >
      <div className="h-full w-full flex text-white justify-end flex-col group/item bg-black/35 hover:bg-primary/55 rounded-3xl duration-[2000ms]">
        <h1 className="text-center text-4xl group-hover/item:text-3xl font-semibold px-8">
          {role}
        </h1>
        <h1 className="invisible group-hover/item:visible duration-[1000ms] group-hover/item:text-4xl text-sm font-bold text-center">
          {title}
        </h1>
        <div className="invisible group-hover/item:visible duration-[1000ms] flex flex-row items-center justify-around group-hover/item:py-8 text-4xl">
          <Link className="hover:scale-125 duration-500" href={social.Facebook}>
            <FaFacebookSquare />
          </Link>
          <Link
            className="hover:scale-125 duration-500"
            href={social.Instagram}
          >
            <FaInstagramSquare />
          </Link>
          <Link className="hover:scale-125 duration-500" href={social.LinkedIn}>
            <FaLinkedin />
          </Link>
        </div>
      </div>
    </div>
  );
}
