import React from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  backgroundColor?: "white" | "gray" | "brand";
}

const Section: React.FC<SectionProps> = ({
  children,
  className = "",
  backgroundColor = "white",
}) => {
  const getBgColor = () => {
    switch (backgroundColor) {
      case "gray":
        return "bg-gray-50";
      case "brand":
        return "bg-gradient-to-br from-brand-400 to-purple-600";
      default:
        return "bg-white";
    }
  };

  return (
    <section
      className={`font-pretendard py-12 sm:py-16 lg:py-20 ${getBgColor()} ${className}`}
    >
      {children}
    </section>
  );
};

export default Section;
