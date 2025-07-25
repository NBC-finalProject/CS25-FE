import React from "react";
import Container from "./common/Container";
import Section from "./common/Section";

const PrivacyPolciiy: React.FC = () => {
  return (
    <Section className="to-brand-50 bg-gradient-to-br from-gray-50 via-blue-50 py-16">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 sm:mb-12 text-center">
            <h1 className="mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              개인정보처리방침
            </h1>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 lg:p-8 shadow-sm">
            <div className="space-y-6 sm:space-y-8 text-gray-700 text-sm sm:text-base" style={{ wordBreak: 'keep-all' }}>
              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제1조 목적
                </h2>
                <p className="leading-relaxed text-gray-700">
                  <span className="text-brand-600 font-medium">CS25</span>
                  (이하 “서비스”라 함)는 통신비밀보호법, 전기통신사업법,
                  개인정보보호법 등 정보통신서비스 제공자가 준수하여야 할 관련
                  법령상의 개인정보보호 규정을 준수하며, 관련 법령에 의거한
                  개인정보취급방침을 정하여 이용자 권익 보호에 최선을 다하고
                  있습니다.
                </p>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제2조 수집하는 개인정보의 항목 및 수집방법
                </h2>
                <p className="mb-4 font-semibold leading-relaxed text-gray-900">
                  1. 수집하는 개인정보의 항목
                </p>
                <div className="space-y-2 sm:space-y-3">
                  <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
                    <span className="text-brand-600 font-medium">
                      ① 서비스는 회원가입, 원활한 고객상담, 각종 서비스 등
                      기본적인 서비스 제공을 위해 아래와 같은 개인정보를
                      수집하고 있습니다.
                    </span>
                    <p className="mt-1 text-gray-700">
                      이름, 닉네임, 이메일, 메일링 수신여부(만 14세 미만인 경우
                      법정대리인 정보), 본인인증 시 암호화된 이용자 확인값(CI)
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
                    <span className="text-brand-600 font-medium">
                      ② 서비스 이용과정에서 아래와 같은 정보들이 자동으로
                      생성되어 수집될 수 있습니다.
                    </span>
                    <p className="mt-1 text-gray-700">
                      IP address, 쿠키, 방문일시, 서비스 이용기록
                    </p>
                  </div>
                  <p className="mb-4 font-semibold leading-relaxed text-gray-900">
                    2. 개인정보 수집방법
                  </p>
                  <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
                    <p className="mt-1 text-gray-700">
                      ① 홈페이지, 이메일 구독 신청 폼 등 온라인 입력 양식을 통한
                      수집
                    </p>
                    <p className="mt-1 text-gray-700">
                      ②서비스 이용 과정에서 자동으로 생성되는 정보의 수집 (예:
                      접속 로그, 쿠키, IP 정보 등)
                    </p>
                    <p className="mt-1 text-gray-700">
                      ③ SNS 로그인 연동을 통해 제공받은 정보 수집
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제3조 개인정보의 수집 및 이용목적
                </h2>
                <div className="rounded-lg bg-gray-50 p-4">
                  <span className="text-brand-600 font-medium">
                    ① 서비스 제공에 관한 계약 이행
                  </span>
                  <p className="mt-1 text-gray-700">
                    컨텐츠 제공, 특정 맞춤 서비스 제공, 본인인증
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <span className="text-brand-600 font-medium">② 회원관리</span>
                  <p className="mt-1 text-gray-700">
                    회원제 서비스 이용에 따른 본인확인, 개인 식별, 불량회원의
                    부정 이용 방지와 비인가 사용 방지, 가입 의사 확인, 연령확인,
                    만 14세 미만 아동 개인정보 수집 시 법정 대리인 동의여부
                    확인, 불만처리 등 민원처리, 고지사항 전달
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <span className="text-brand-600 font-medium">
                    ③ 신규 서비스 개발 및 마케팅, 광고에 활용
                  </span>
                  <p className="mt-1 text-gray-700">
                    신규 서비스 개발 및 맞춤 서비스 제공, 통계학적 특성에 따른
                    서비스 제공 및 광고 게재, 서비스의 유효성 확인, 이벤트 및
                    광고성 정보 제공 및 참여기회 제공, 접속 빈도 파악, 회원의
                    서비스 이용에 대한 통계
                  </p>
                </div>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제4조 개인정보 공유
                </h2>
                <div className="space-y-2">
                  <p className="leading-relaxed text-gray-700">
                    “서비스”는 이용자들의 개인정보를{" "}
                    <span className="text-brand-600 font-medium">
                      2. 개인정보의 수집 및 이용목적
                    </span>{" "}
                    에서 고지한 범위내에서 사용하며, 이용자의 사전 동의 없이는
                    동 범위를 초과하여 이용하거나 원칙적으로 개인정보를 외부에
                    공개하지 않습니다.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    다만, 아래의 경우에는 예외로 합니다.
                  </p>
                  <ul className="ml-3 sm:ml-4 list-inside list-disc space-y-1 text-gray-700">
                    <li>이용자들이 사전에 공개에 동의한 경우</li>
                    <li>
                      법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진
                      절차와 방법에 따라 수사기관의 요구가 있는 경우
                    </li>
                  </ul>
                </div>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제5조 개인정보의 취급위탁
                </h2>
                <div className="space-y-2">
                  <p className="leading-relaxed text-gray-700">
                    “서비스”는 기본적으로 개인정보를 취급 위탁하지 않습니다.
                  </p>
                </div>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제6조 개인정보의 보유 및 이용기간
                </h2>
                <p className="leading-relaxed text-gray-700">
                  "서비스"는 회원가입일로부터 서비스를 제공하는 기간 동안에
                  한하여 이용자의 개인정보를 보유 및 이용하게 됩니다. 회원탈퇴를
                  요청하거나 개인정보의 수집 및 이용에 대한 동의를 철회하는
                  경우, 수집 및 이용목적이 달성되었거나 보유 및 이용기간이
                  종료한 경우 해당 개인정보를 지체 없이 파기합니다. 또한
                  관계법령의 규정에 의하여 보존할 필요가 있는 경우 “서비스”는
                  아래와 같은 관계법령에서 정한 일정한 기간 동안 회원정보를
                  보관할 수 있습니다.
                </p>
                <ul className="ml-3 sm:ml-4 list-inside list-disc space-y-1 text-gray-700">
                  <li>
                    계약 또는 청약철회 등에 관한 기록 : 5년(전자상거래 등에서의
                    소비자보호에 관한 법률)
                  </li>
                  <li>
                    대금결제 및 재화 등의 공급에 관한 기록 : 5년(전자상거래
                    등에서의 소비자보호에 관한 법률)
                  </li>
                  <li>
                    소비자의 불만 또는 분쟁처리에 관한 기록 : 3년(전자상거래
                    등에서의 소비자보호에 관한 법률)
                  </li>
                  <li>웹사이트 방문기록 : 3개월(통신비밀보호법)</li>
                </ul>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제7조 개인정보 파기절차 및 방법
                </h2>
                <div className="space-y-2">
                  <p className="leading-relaxed text-gray-700">
                    이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이
                    달성되면 지체없이 파기합니다. “서비스”의 개인정보 파기절차
                    및 방법은 다음과 같습니다.
                  </p>
                  <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
                    <div className="p-4">
                      <span className="text-brand-600 font-medium">
                        ① 파기절차
                      </span>
                      <p className="mt-1 text-gray-700">
                        이용자가 회원가입 등을 위해 입력한 정보는 목적이 달성된
                        후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 내부
                        방침 및 기타 관련 법령에 의한 정보보호 사유에 따라(보유
                        및 이용기간 참조)일정 기간 저장된 후 파기됩니다.
                      </p>
                      <p className="mt-1 text-gray-700">
                        개인정보는 법률에 의한 경우가 아니고서는 보유되는 이외의
                        다른 목적으로 이용되지 않습니다.
                      </p>
                      <p className="mt-1 text-gray-700">
                        "서비스"는 관련 법령에 따라 1년 이상 서비스를 이용하지
                        않은 회원의 개인정보를 별도로 분리하여 삭제하고
                        있습니다.
                      </p>
                    </div>
                    <div className="p-4">
                      <span className="text-brand-600 font-medium">
                        ② 파기방법
                      </span>
                      <p className="mt-1 text-gray-700">
                        종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을
                        통하여 파기합니다.
                      </p>
                      <p className="mt-1 text-gray-700">
                        전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수
                        없는 기술적 방법을 사용하여 삭제합니다.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제8조 이용자 및 법정대리인의 권리와 그 행사방법
                </h2>
                <div className="space-y-2">
                  <p className="leading-relaxed text-gray-700">
                    이용자 및 법정 대리인은 언제든지 등록되어 있는 자신 혹은
                    당해 만 14세 미만 아동의 개인정보를 조회하거나 수정할 수
                    있으며 가입해지를 요청할 수도 있습니다.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    이용자 혹은 만 14세 미만 아동의 개인정보 조회, 수정을
                    위해서는 '개인정보변경'(또는 '회원정보수정' 등)을,
                    가입해지(동의철회)를 위해서는 "회원탈퇴"를 클릭하여 본인
                    확인 절차를 거치신 후 직접 열람, 정정 또는 탈퇴가
                    가능합니다.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    혹은 개인정보관리책임자에게 서면, 전화 또는 이메일로
                    연락하시면 지체 없이 조치하겠습니다.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    이용자가 개인정보의 오류에 대한 정정을 요청하신 경우에는
                    정정을 완료하기 전까지 당해 개인정보를 이용 또는 제공하지
                    않습니다. 또한 잘못된 개인정보를 제3 자에게 이미 제공한
                    경우에는 정정 처리결과를 제3자에게 지체 없이 통지하여 정정이
                    이루어지도록 하겠습니다.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    “서비스”는 이용자 혹은 법정 대리인의 요청에 의해 해지 또는
                    삭제된 개인정보는{" "}
                    <span className="text-brand-600 font-medium">
                      5. 개인정보의 보유 및 이용기간
                    </span>
                    에 명시된 바에 따라 처리하고 그 외의 용도로 열람 또는 이용할
                    수 없도록 처리하고 있습니다.
                  </p>
                </div>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제9조 개인정보 자동 수집 장치의 설치/운영 및 거부에 관한 사항
                </h2>
                <div className="space-y-2 sm:space-y-3">
                  <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
                    <span className="text-brand-600 font-medium">
                      ① 쿠키 사용
                    </span>
                    <p className="mt-1 text-gray-700">
                      이용자들이 방문한 각 서비스와 웹 사이트들에 대한 방문 및
                      이용형태, 인기 검색어, 이용자 규모 등을 파악하여
                      이용자에게 최적화된 정보 제공을 위하여 사용합니다.
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
                    <span className="text-brand-600 font-medium">
                      ② 쿠키 설치 운영 및 거부
                    </span>
                    <p className="mt-1 text-gray-700">
                      이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다.
                      따라서, 이용자는 웹브라우저에서 옵션을 설정함으로써 모든
                      쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나,
                      아니면 모든 쿠키의 저장을 거부할 수도 있습니다.
                    </p>
                    <p className="mt-1 text-gray-700">
                      쿠키 설정을 거부하는 방법으로는 이용자가 사용하는 웹
                      브라우저의 옵션을 선택함으로써 모든 쿠키를 허용하거나
                      쿠키를 저장할 때마다 확인을 거치거나, 모든 쿠키의 저장을
                      거부할 수 있습니다.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제10조 개인정보의 기술적/관리적 보호 대책
                </h2>
                <div className="space-y-2 sm:space-y-3">
                  <p className="leading-relaxed text-gray-700">
                    “서비스”는 이용자의 개인정보를 취급함에 있어 개인정보가
                    분실, 도난, 누출, 변조 또는 훼손되지 않도록 안정성 확보를
                    위해 다음과 같은 기술적/관리적 대책을 강구하고 있습니다.
                  </p>
                  <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
                    <span className="text-brand-600 font-medium">
                      ① 개인정보 암호화
                    </span>
                    <p className="mt-1 text-gray-700">
                      이용자의 개인정보는 파일 및 전송 데이터를 암호화하고
                      있으며, 개인정보의 확인 및 변경도 본인에 의해서만
                      가능합니다.
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
                    <span className="text-brand-600 font-medium">
                      ② 해킹 등에 대비한 대책
                    </span>
                    <p className="mt-1 text-gray-700">
                      “서비스”는 해킹이나 컴퓨터 바이러스 등에 의해 회원의
                      개인정보가 유출되거나 훼손되는 것을 막기 위해 최선을
                      다하고 있습니다. 개인정보의 훼손에 대비하여 자료를
                      주기적으로 백업하고 있으며, 이용자들의 개인정보나 자료가
                      누출되거나 손상되지 않도록 방지하고 있습니다.
                    </p>
                    <p className="mt-1 text-gray-700">
                      또한 침입차단시스템과 침입방지시스템을 이용하여
                      외부로부터의 무단 접근을 통제하고 있으며, 기타
                      시스템적으로 보안성을 확보하기 위한 가능한 모든 기술적
                      장치를 갖추려 노력하고 있습니다.
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
                    <span className="text-brand-600 font-medium">
                      ③ 개인정보처리시스템 접근 제한
                    </span>
                    <p className="mt-1 text-gray-700">
                      “서비스”는 는 개인정보를 처리할 수 있도록 체계적으로
                      구성한 데이터베이스시스템에 대한 접근권한의 부여, 변경,
                      말소 등에 관한 기준을 수립하고 기타 개인정보에 대한
                      접근통제를 위해 필요한 조치를 다하고 있습니다.
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
                    <span className="text-brand-600 font-medium">
                      ④ 개인정보 취급 직원의 교육
                    </span>
                    <p className="mt-1 text-gray-700">
                      “서비스”는 개인정보관련 취급 직원은 담당자에 한정시켜
                      최소화하고 새로운 보안기술의 습득 및 개인정보보호 의무에
                      정기적인 교육을 실시하며 별도의 비밀번호를 부여하여 접근
                      권한을 관리하는 등 관리적 대책을 시행하고 있습니다.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제11조 개인정보관리책임자 및 담당자의 연락처
                </h2>
                <div className="space-y-2 sm:space-y-3">
                  <p className="leading-relaxed text-gray-700">
                    “서비스”는 개인정보를 보호하고 개인정보와 관련한 불만을
                    처리하기 위하여 개인정보관리책임자를 지정하고 있으며,
                    서비스를 이용하시며 발생하는 모든 개인정보보호 관련 민원을
                    개인정보관리책임자 혹은 담당부서로 신고하실 수 있습니다
                  </p>
                  <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
                    <span className="text-brand-600 font-medium">
                      ① 개인정보 관리책임자
                    </span>
                    <p className="mt-1 text-gray-700">
                      CS25팀 / noreplycs25@gmail.com
                    </p>
                  </div>
                  <p className="mb-2 leading-relaxed text-gray-700">
                    기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는
                    아래 기관에 문의하시기 바랍니다.
                  </p>
                  <ul className="ml-3 sm:ml-4 list-inside list-disc space-y-1 text-gray-700">
                    <li>개인정보침해신고센터(국번없이 118)</li>
                    <li>정보보호마크인증위원회(02-580-0533~4)</li>
                    <li>대검찰청 인터넷범죄수사센터(02-3480-3600)</li>
                    <li>경찰청 사이버테러대응센터(02-392-0330)</li>
                  </ul>
                </div>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  12조 비회원의 개인정보 수집 및 처리
                </h2>
                <p className="mb-2 leading-relaxed text-gray-700">
                  ① 비회원은 이메일 주소 입력을 통해 구독 신청이 가능하며, 해당
                  이메일은 맞춤형 콘텐츠 제공 및 통계 분석 등의 서비스 제공
                  목적으로만 수집됩니다.
                </p>
                <p className="mb-2 leading-relaxed text-gray-700">
                  ② 구독 해지 요청 시 즉시 파기되며, 제3자에게 제공되지
                  않습니다.
                </p>
                <p className="mb-2 leading-relaxed text-gray-700">
                  ③ 비회원은 자신의 개인정보 열람, 정정, 삭제를 요청할 수
                  있으며, 해당 요청은 개인정보관리책임자를 통해 처리됩니다.
                </p>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  13조 기타
                </h2>
                <p className="mb-2 leading-relaxed text-gray-700">
                  "서비스"에 링크되어 있는 웹사이트들이 개인정보를 수집하는
                  행위에 대해서는 본{" "}
                  <span className="text-brand-600 font-medium">
                    서비스 개인정보취급방침
                  </span>
                  이 적용되지 않음을 알려 드립니다.
                </p>
              </section>
            </div>

            <div className="mt-6 sm:mt-8 rounded-lg bg-gray-50 p-4 sm:p-6 text-center">
              <h3 className="mb-2 text-base sm:text-lg font-semibold text-gray-900">부칙</h3>
              <p className="text-sm sm:text-base text-gray-700">
                본 개인정보처리방침은{" "}
                <span className="text-brand-600 font-medium">
                  2025년 7월 25일
                </span>
                부터 시행됩니다.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default PrivacyPolciiy;
