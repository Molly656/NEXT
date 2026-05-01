import Image from "next/image";

export default function AcmeLogo() {
  return (
    <div className="flex flex-row items-center leading-none text-white">
      <Image
        src="/logo.png"
        alt="Company logo"
        width={48}
        height={48}
        className="h-12 w-12"
      />
    </div>
  );
}
