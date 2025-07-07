import React from "react";

interface SocialButtonProps {
  provider: "kakao" | "github" | "naver";
  onClick: () => void;
  children: React.ReactNode;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  onClick,
  children,
}) => {
  const getButtonStyles = () => {
    switch (provider) {
      case "kakao":
        return "bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-500 hover:shadow-yellow-200 shadow-yellow-100";
      case "github":
        return "bg-gray-800 text-white border-gray-800 hover:bg-gray-700 hover:shadow-gray-400 shadow-gray-300";
      case "naver":
        return "bg-green-500 text-white border-green-500 hover:bg-green-600 hover:shadow-green-200 shadow-green-100";
    }
  };

  const getIcon = () => {
    switch (provider) {
      case "kakao":
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 5.64 2 10.25c0 2.9 1.88 5.45 4.68 6.99l-1.3 4.74c-.08.29.23.52.48.37l5.8-3.79c.46.03.91.04 1.34.04 5.52 0 10-3.64 10-8.25S17.52 2 12 2z" />
          </svg>
        );
      case "github":
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        );
      case "naver":
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
          </svg>
        );
    }
  };

  return (
    <button
      onClick={onClick}
      className={`mb-3 flex w-full items-center rounded-xl border px-5 py-4 text-base font-medium shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${getButtonStyles()}`}
    >
      <div className="flex w-full items-center gap-3">
        <div className="flex w-4 justify-start">{getIcon()}</div>
        <div className="flex-1 text-center">{children}</div>
        <div className="w-4"></div>
      </div>
    </button>
  );
};

export default SocialButton;
