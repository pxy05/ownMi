import React from "react";
import Image from "next/image";

const FooterLinks = ({ props }: { props: [string, string, string] }) => {
  const [imageLink, link, alt] = props;
  return (
    <a
      className="flex items-center gap-2 hover:underline hover:underline-offset-4"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image aria-hidden src={imageLink} alt={alt} width={16} height={16} />
      GitHub
    </a>
  );
};

export default FooterLinks;
