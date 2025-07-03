import React, { useEffect, useMemo, useState } from "react";
import { Sparkle } from "lucide-react";
import { loadFull } from "tsparticles";
import Container from "../common/Container";
import Section from "../common/Section";
import { subscribeButtonParticleOptions } from "../../utils/particleConfig";

import Particles, { initParticlesEngine } from "@tsparticles/react";


interface HeroSectionProps {
  onSubscribeClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSubscribeClick }) => {
  const [particleState, setParticlesReady] = useState<"loaded" | "ready">();
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setParticlesReady("loaded");
    });
  }, []);

  const modifiedOptions = useMemo(() => {
    const options = { ...subscribeButtonParticleOptions };
    options.autoPlay = isHovering;
    return options;
  }, [isHovering]);
  return (
    <Section className="to-brand-50 bg-gradient-to-br from-gray-50 via-blue-50 pb-20 pt-16 text-center sm:pb-32 sm:pt-20">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="bg-brand-100 mb-6 inline-flex items-center rounded-full px-4 py-2 sm:mb-8 sm:px-6">
            <span className="text-brand-700 text-xs font-medium sm:text-sm">
              AI가 생성하고 해설하는 CS 지식
            </span>
          </div>

          <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
            AI가 전하는
            <br />
            <span className="from-brand-600 to-navy-600 bg-gradient-to-r bg-clip-text text-transparent">
              데일리 CS 지식
            </span>
            <br />
            메일로 만나보세요!
          </h1>

          <div className="mx-auto mb-8 max-w-3xl px-4 sm:mb-12 sm:px-0">
            {/* 메인 설명 텍스트 */}
            <div className="mb-6 text-center">
              <p className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-lg font-medium leading-relaxed text-transparent sm:text-xl md:text-2xl lg:text-3xl">
                <span className="relative inline-block">
                  <span className="from-brand-600 to-navy-600 bg-gradient-to-r bg-clip-text font-bold text-transparent">
                    AI가 매일 새로운 CS 문제를 생성
                  </span>
                  <span className="from-brand-400 to-navy-400 absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r opacity-60"></span>
                </span>
                <br className="block sm:hidden" />
                <span className="hidden sm:inline">하고 상세히 해설</span>
                <span className="mt-1 block sm:hidden">하고 상세히 해설</span>
              </p>
            </div>

            {/* 설명 텍스트 */}
            <p className="mt-4 text-center text-sm text-gray-500 sm:mt-6 sm:text-base">
              개인 수준에 맞는 맞춤형 문제로
              <br className="block sm:hidden" />
              <span className="hidden sm:inline"> </span>효율적인 학습을
              경험하세요!
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <button
              onClick={onSubscribeClick}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="animate-subscribe-pulse from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 focus:from-brand-600 focus:to-brand-700 active:from-brand-700 active:to-brand-800 focus:ring-brand-300 group relative max-w-sm overflow-hidden rounded-full bg-gradient-to-r px-6 py-3 text-base font-semibold text-white transition-all duration-500 hover:scale-105 hover:animate-none hover:shadow-2xl focus:outline-none focus:ring-4 active:scale-95 sm:max-w-none sm:px-8 sm:py-4 sm:text-lg"
            >
              {/* 반짝이는 애니메이션 효과 */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-1000 group-hover:animate-pulse group-hover:opacity-100"></div>

              {/* 물결 효과 */}
              <div className="absolute inset-0 -z-10 rounded-full bg-white/10 opacity-0 transition-all duration-700 group-hover:scale-150 group-hover:opacity-100"></div>

              <span className="relative flex items-center justify-center gap-2">
                <Sparkle className="group-hover:animate-sparkle absolute bottom-2 left-2 z-20 h-2 w-2 rotate-12 fill-white opacity-0 transition-all duration-300 group-hover:opacity-100" />
                <Sparkle className="group-hover:animate-sparkle absolute left-1 top-2 h-1.5 w-1.5 -rotate-12 fill-white opacity-0 transition-all duration-300 group-hover:opacity-100" />
                <Sparkle className="group-hover:animate-sparkle absolute right-2 top-2 h-1.5 w-1.5 fill-white opacity-0 transition-all duration-300 group-hover:opacity-100" />
                <span className="group-hover:animate-text-shimmer bg-gradient-to-r from-white via-white/90 to-white bg-[length:200%_auto] bg-clip-text transition-all duration-300 group-hover:tracking-wide">
                  무료 구독하기
                </span>
              </span>

              {/* 파티클 효과 */}
              {!!particleState && (
                <Particles
                  id="subscribe-particles"
                  className={`pointer-events-none absolute -bottom-4 -left-4 -right-4 -top-4 z-0 opacity-0 transition-opacity duration-500 ${particleState === "ready" ? "group-hover:opacity-100" : ""}`}
                  particlesLoaded={async () => {
                    setParticlesReady("ready");
                  }}
                  options={modifiedOptions}
                />
              )}
            </button>

            <div className="flex items-center text-xs text-gray-600 sm:text-sm">
              <div className="mr-2 flex -space-x-1 sm:mr-3 sm:-space-x-2">
                <div className="from-brand-400 to-brand-500 h-6 w-6 rounded-full border-2 border-white bg-gradient-to-r sm:h-8 sm:w-8"></div>
                <div className="from-navy-400 to-navy-500 h-6 w-6 rounded-full border-2 border-white bg-gradient-to-r sm:h-8 sm:w-8"></div>
                <div className="from-brand-500 to-navy-500 h-6 w-6 rounded-full border-2 border-white bg-gradient-to-r sm:h-8 sm:w-8"></div>
              </div>
              <span className="text-center sm:text-left">
                이미 <strong className="text-gray-800">10+</strong> 취준생이
                사용 중
              </span>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default HeroSection;
