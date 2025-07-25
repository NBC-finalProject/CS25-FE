import React from "react";
import Container from "./common/Container";
import Section from "./common/Section";

const TermsOfService: React.FC = () => {
  return (
    <Section className="to-brand-50 bg-gradient-to-br from-gray-50 via-blue-50 py-16">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 sm:mb-12 text-center">
            <h1 className="mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              서비스 이용약관
            </h1>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 lg:p-8 shadow-sm">
            <div className="space-y-6 sm:space-y-8 text-gray-700 text-sm sm:text-base" style={{ wordBreak: 'keep-all' }}>
              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제1조 목적
                </h2>
                <p className="leading-relaxed text-gray-700">
                  본 이용약관은{" "}
                  <span className="text-brand-600 font-medium">CS25</span>
                  (이하 사이트)의 서비스의 이용조건과 운영에 관한 제반 사항
                  규정을 목적으로 합니다.
                </p>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제2조 용어의 정의
                </h2>
                <p className="mb-4 leading-relaxed text-gray-700">
                  본 약관에서 사용되는 주요한 용어의 정의는 다음과 같습니다.
                </p>
                <div className="space-y-2 sm:space-y-3">
                  <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
                    <span className="text-brand-600 font-medium">① 회원</span>
                    <p className="mt-1 text-gray-700">
                      사이트의 약관에 동의하고 개인정보를 제공하여 회원등록을 한
                      자로서, 사이트와의 이용계약을 체결하고 사이트를 이용하는
                      이용자를 말합니다.
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
                    <span className="text-brand-600 font-medium">
                      ② 비회원 구독자
                    </span>
                    <p className="mt-1 text-gray-700">
                      사이트에 회원가입하지 않고 이메일 정보를 제공하여 콘텐츠
                      구독을 신청한 자를 말하며, 본 약관 중 일부 조항은 해당
                      구독자에게도 적용될 수 있습니다.
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
                    <span className="text-brand-600 font-medium">
                      ③ 이용계약
                    </span>
                    <p className="mt-1 text-gray-700">
                      사이트 이용과 관련하여 사이트와 회원간에 체결 하는 계약을
                      말합니다.
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
                    <span className="text-brand-600 font-medium">
                      ④ 회원 이메일
                    </span>
                    <p className="mt-1 text-gray-700">
                      회원의 식별과 서비스 이용을 위하여 회원이 등록한 고유한
                      이메일 주소를 말합니다.
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
                    <span className="text-brand-600 font-medium">⑤ 운영자</span>
                    <p className="mt-1 text-gray-700">
                      서비스에 홈페이지를 개설하여 운영하는 운영자를 말합니다.
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
                    <span className="text-brand-600 font-medium">⑥ 해지</span>
                    <p className="mt-1 text-gray-700">
                      회원이 이용계약을 해약하는 것을 말합니다.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제3조 약관 외 준칙
                </h2>
                <p className="leading-relaxed text-gray-700">
                  운영자는 필요한 경우 별도로{" "}
                  <span className="text-brand-600 font-medium">운영정책</span>을
                  공지 안내할 수 있으며, 본 약관과 운영정책이 중첩될 경우
                  운영정책이 우선 적용됩니다.
                </p>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제4조 이용계약 체결
                </h2>
                <div className="space-y-2 sm:space-y-2">
                  <p className="leading-relaxed text-gray-700">
                    ① 이용계약은 회원으로 등록하여 사이트를 이용하려는 자가 본
                    약관 내용에 동의한 후, 소셜 로그인 등 사이트에서 제공하는
                    방식으로 회원가입 또는 로그인을 완료하고, 이에 대하여
                    운영자가 승낙함으로써 성립합니다.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ② 회원으로 등록하고 서비스를 이용하고자 하는 자는 사이트에
                    표시된 로그인 버튼 클릭 또는 소셜 계정 로그인 시, 본 약관과
                    개인정보처리방침에 동의한 것으로 간주합니다.
                  </p>
                </div>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제5조 서비스 이용 신청
                </h2>
                <div className="space-y-2 sm:space-y-2">
                  <p className="leading-relaxed text-gray-700">
                    ① 회원으로 등록하여 사이트를 이용하려는 이용자는 사이트에서
                    요청하는 제반정보(이메일, 닉네임 등)를 제공해야 합니다.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ② 타인의 정보를 도용하거나 허위의 정보를 등록하는 등 본인의
                    진정한 정보를 등록하지 않은 회원은 사이트 이용과 관련하여
                    아무런 권리를 주장할 수 없으며, 관계 법령에 따라 처벌받을 수
                    있습니다.
                  </p>
                </div>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제6조 개인정보처리방침
                </h2>
                <p className="leading-relaxed text-gray-700">
                  사이트 및 운영자는 이용자로부터 수집한 개인정보를 관련 법령 및{" "}
                  <span className="text-brand-600 font-medium">
                    개인정보처리방침
                  </span>
                  에 따라 안전하게 보호하며, 수집한 정보는 서비스 제공 및 운영
                  목적 외의 용도로 사용되지 않습니다. 또한 회원 및 비회원의
                  개인정보는 제3자에게 제공되지 않으며, 필요 이상으로 저장하거나
                  열람하지 않습니다.
                </p>
                <p className="py-2 leading-relaxed text-gray-700">
                  단, 법령에 의한 요청, 수사기관의 요청, 미풍양속 또는
                  국가안보에 위배되는 게시물의 경우, 관련 기관에 자료를 제공할
                  수 있습니다.
                </p>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제7조 운영자의 의무
                </h2>
                <div className="space-y-2 sm:space-y-2">
                  <p className="leading-relaxed text-gray-700">
                    ① 운영자는 이용회원으로부터 제기되는 의견이나 불만이
                    정당하다고 인정할 경우에는 가급적 빨리 처리하여야 합니다.
                    다만, 개인적인 사정으로 신속한 처리가 곤란한 경우에는 사후에
                    공지 또는 이용회원에게 쪽지, 전자우편 등을 보내는 등 최선을
                    다합니다.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ② 운영자는 계속적이고 안정적인 사이트 제공을 위하여 설비에
                    장애가 생기거나 유실된 때에는 이를 지체 없이 수리 또는
                    복구할 수 있도록 사이트에 요구할 수 있습니다. 다만, 천재지변
                    또는 사이트나 운영자에 부득이한 사유가 있는 경우, 사이트
                    운영을 일시 정지할 수 있습니다.
                  </p>
                </div>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제8조 회원의 의무
                </h2>
                <div className="space-y-2 sm:space-y-2">
                  <p className="leading-relaxed text-gray-700">
                    ① 회원은 본 약관에서 규정하는 사항과 운영자가 정한 제반
                    규정, 공지사항 및 운영정책 등 사이트가 공지하는 사항 및 관계
                    법령을 준수하여야 하며, 기타 사이트의 업무에 방해가 되는
                    행위, 사이트의 명예를 손상하는 행위를 해서는 안 됩니다.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ② 회원은 사이트의 명시적 동의가 없는 한 서비스의 이용 권한,
                    기타 이용계약상 지위를 타인에게 양도, 증여할 수 없으며, 이를
                    담보로 제공할 수 없습니다.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ③ 이용고객은 아이디 및 비밀번호 관리에 상당한 주의를
                    기울여야 하며, 운영자나 사이트의 동의 없이 제3자에게
                    아이디를 제공하여 이용하게 할 수 없습니다.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ④ 회원은 운영자와 사이트 및 제3자의 지적 재산권을 침해해서는
                    안 됩니다.
                  </p>
                </div>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제9조 서비스 이용 시간
                </h2>
                <div className="space-y-2 sm:space-y-2">
                  <p className="leading-relaxed text-gray-700">
                    ① 서비스 이용 시간은 업무상 또는 기술상 특별한 지장이 없는
                    한 연중무휴 1일 24시간을 원칙으로 합니다. 단, 사이트는
                    시스템 정기점검, 증설 및 교체를 위해 운영자가 정한 날이나
                    시간에 서비스를 일시중단 할 수 있으며 예정된 작업으로 인한
                    서비스 일시 중단은 사이트의 홈페이지에 사전에 공지하오니
                    수시로 참고하시길 바랍니다.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ② 단, 사이트는 다음 경우에 대하여 사전 공지나 예고 없이
                    서비스를 일시적 혹은 영구적으로 중단할 수 있습니다.
                  </p>
                  <ul className="ml-3 sm:ml-4 list-inside list-disc space-y-1 text-gray-700">
                    <li>
                      긴급한 시스템 점검, 증설, 교체, 고장 혹은 오동작을
                      일으키는 경우
                    </li>
                    <li>
                      국가비상사태, 정전, 천재지변 등의 불가항력적인 사유가 있는
                      경우
                    </li>
                    <li>
                      전기통신사업법에 규정된 기간통신사업자가 전기통신 서비스를
                      중지한 경우
                    </li>
                    <li>
                      서비스 이용의 폭주 등으로 정상적인 서비스 이용에 지장이
                      있는 경우
                    </li>
                  </ul>
                  <p className="leading-relaxed text-gray-700">
                    ③ 전항에 의한 서비스 중단의 경우 사이트는 사전에 공지사항
                    등을 통하여 회원에게 통지합니다. 단, 사이트가 통제할 수 없는
                    사유로 발생한 서비스의 중단에 대하여 사전공지가 불가능한
                    경우에는 사후공지로 대신합니다.
                  </p>
                </div>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제10조 서비스 이용 해지
                </h2>
                <div className="space-y-2 sm:space-y-2">
                  <p className="leading-relaxed text-gray-700">
                    ① 회원이 사이트와의 이용계약을 해지하고자 하는 경우에는 회원
                    본인이 온라인을 통하여 등록해지 신청을 하여야 합니다. 한편,
                    사이트 이용 해지와 별개로 사이트에 대한 이용계약 해지는
                    별도로 하셔야 합니다.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ② 해지 신청과 동시에 사이트가 제공하는 사이트 관련
                    프로그램이 회원 관리 화면에서 자동적으로 삭제됨으로 운영자는
                    더 이상 해지신청자의 정보를 볼 수 없습니다.
                  </p>
                </div>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제11조 서비스 이용 제한
                </h2>
                <p className="mb-2 leading-relaxed text-gray-700">
                  회원은 다음 각호에 해당하는 행위를 하여서는 아니 되며 해당
                  행위를 한 경우에 사이트는 회원의 서비스 이용 제한 및 적법한
                  조치를 할 수 있으며 이용계약을 해지하거나 기간을 정하여
                  서비스를 중지할 수 있습니다.
                </p>
                <div className="space-y-1 sm:space-y-1">
                  <p className="leading-relaxed text-gray-700">
                    ① 회원 가입시 혹은 가입 후 정보 변경 시 허위 내용을 등록하는
                    행위
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ② 타인의 사이트 이용을 방해하거나 정보를 도용하는 행위
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ③ 사이트의 운영진, 직원 또는 관계자를 사칭하는 행위
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ④ 사이트, 기타 제3자의 인격권 또는 지적재산권을 침해하거나
                    업무를 방해하는 행위
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ⑤ 다른 회원의 이메일을 부정하게 사용하는 행위
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ⑥ 다른 회원에 대한 개인정보를 그 동의 없이 수집, 저장,
                    공개하는 행위
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ⑦ 범죄와 결부된다고 객관적으로 판단되는 행위
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ⑧ 기타 관련 법령에 위배되는 행위
                  </p>
                </div>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제12조 게시물의 관리
                </h2>
                <div className="space-y-2 sm:space-y-2">
                  <p className="leading-relaxed text-gray-700">
                    ① 사이트의 게시물과 자료의 관리 및 운영의 책임은 운영자에게
                    있습니다. 운영자는 항상 불량 게시물 및 자료에 대하여
                    모니터링을 하여야 하며, 불량 게시물 및 자료를 발견하거나
                    신고를 받으면 해당 게시물 및 자료를 삭제하고 이를 등록한
                    회원에게 주의를 주어야 합니다. 한편, 이용회원이 올린
                    게시물에 대해서는 게시자 본인에게 책임이 있으니 회원 스스로
                    본 이용약관에서 위배되는 게시물은 게재해서는 안 됩니다.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ② 정보통신윤리위원회 등 공공기관의 시정요구가 있는 경우
                    운영자는 회원의 사전동의 없이 게시물을 삭제하거나 이동 할 수
                    있습니다.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ③ 불량게시물의 판단기준은 다음과 같습니다.
                  </p>
                  <ul className="ml-3 sm:ml-4 list-inside list-disc space-y-1 text-gray-700">
                    <li>
                      다른 회원 또는 제3자에게 심한 모욕을 주거나 명예를
                      손상하는 내용인 경우
                    </li>
                    <li>
                      공공질서 및 미풍양속에 위반되는 내용을 유포하거나 링크
                      시키는 경우
                    </li>
                    <li>불법 복제 또는 해킹을 조장하는 내용인 경우</li>
                    <li>영리를 목적으로 하는 광고일 경우</li>
                    <li>범죄와 결부된다고 객관적으로 인정되는 내용일 경우</li>
                    <li>
                      다른 이용자 또는 제3자와 저작권 등 기타 권리를 침해하는
                      경우
                    </li>
                    <li>기타 관계 법령에 위배된다고 판단되는 경우</li>
                  </ul>
                  <p className="leading-relaxed text-gray-700">
                    ④ 사이트 및 운영자는 게시물 등에 대하여 제3자로부터
                    명예훼손, 지적재산권 등의 권리 침해를 이유로 게시중단 요청을
                    받은 경우 이를 임시로 게시 중단할 수 있으며, 게시중단
                    요청자와 게시물 등록자 간에 소송, 합의 기타 이에 준하는 관련
                    기관의 결정 등이 이루어져 사이트에 접수된 경우 이에
                    따릅니다.
                  </p>
                </div>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제13조 게시물의 보관
                </h2>
                <p className="leading-relaxed text-gray-700">
                  사이트 운영자가 불가피한 사정으로 본 사이트를 중단하게 될
                  경우, 회원에게 사전 공지를 하고 게시물의 이전이 쉽도록 모든
                  조치를 하기 위해 노력합니다.
                </p>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제14조 게시물에 대한 저작권
                </h2>
                <div className="space-y-2 sm:space-y-2">
                  <p className="leading-relaxed text-gray-700">
                    ① 회원이 사이트 내에 게시한 게시물의 저작권은 게시한
                    회원에게 귀속됩니다. 또한 사이트는 게시자의 동의 없이
                    게시물을 상업적으로 이용할 수 없습니다. 다만 비영리 목적인
                    경우는 그러하지 아니하며, 또한 서비스 내의 게재권을
                    갖습니다.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ② 회원은 서비스를 이용하여 취득한 정보를 임의 가공, 판매하는
                    행위 등 서비스에 게재된 자료를 상업적으로 사용할 수
                    없습니다.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ③ 운영자는 회원이 게시하거나 등록하는 사이트 내의 내용물,
                    게시 내용에 대해 제12조 각호에 해당한다고 판단되는 경우
                    사전통지 없이 삭제하거나 이동 또는 등록 거부할 수 있습니다.
                  </p>
                </div>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제15조 손해배상
                </h2>
                <div className="space-y-2 sm:space-y-2">
                  <p className="leading-relaxed text-gray-700">
                    ① 본 사이트의 발생한 모든 민, 형법상 책임은 회원 본인에게
                    1차적으로 있습니다.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ② 본 사이트로부터 회원이 받은 손해가 천재지변 등
                    불가항력적이거나 회원의 고의 또는 과실로 인하여 발생한
                    때에는 손해배상을 하지 않습니다.
                  </p>
                </div>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제16조 면책
                </h2>
                <div className="space-y-2 sm:space-y-2">
                  <p className="leading-relaxed text-gray-700">
                    ① 운영자는 회원이 사이트의 서비스 제공으로부터 기대되는
                    이익을 얻지 못하였거나 서비스 자료에 대한 취사선택 또는
                    이용으로 발생하는 손해 등에 대해서는 책임이 면제됩니다.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ② 운영자는 본 사이트의 서비스 기반 및 타 통신업자가 제공하는
                    전기통신 서비스의 장애로 인한 경우에는 책임이 면제되며 본
                    사이트의 서비스 기반과 관련되어 발생한 손해에 대해서는
                    사이트의 이용약관에 준합니다
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ③ 운영자는 회원이 저장, 게시 또는 전송한 자료와 관련하여
                    일체의 책임을 지지 않습니다.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ④ 운영자는 회원의 귀책 사유로 인하여 서비스 이용의 장애가
                    발생한 경우에는 책임지지 아니합니다.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ⑤ 운영자는 회원 상호 간 또는 회원과 제3자 상호 간, 기타
                    회원의 본 서비스 내외를 불문한 일체의 활동(데이터 전송, 기타
                    커뮤니티 활동 포함)에 대하여 책임을 지지 않습니다.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ⑥ 운영자는 회원이 게시 또는 전송한 자료 및 본 사이트로
                    회원이 제공받을 수 있는 모든 자료들의 진위, 신뢰도, 정확성
                    등 그 내용에 대해서는 책임지지 아니합니다.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ⑦ 운영자는 회원 상호 간 또는 회원과 제3자 상호 간에 서비스를
                    매개로 하여 물품거래 등을 한 경우에 그로부터 발생하는 일체의
                    손해에 대하여 책임지지 아니합니다.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ⑧ 운영자는 운영자의 귀책 사유 없이 회원간 또는 회원과
                    제3자간에 발생한 일체의 분쟁에 대하여 책임지지 아니합니다.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ⑨ 운영자는 서버 등 설비의 관리, 점검, 보수, 교체 과정 또는
                    소프트웨어의 운용 과정에서 고의 또는 고의에 준하는 중대한
                    과실 없이 발생할 수 있는 시스템의 장애, 제3자의 공격으로
                    인한 시스템의 장애, 국내외의 저명한 연구기관이나 보안 관련
                    업체에 의해 대응 방법이 개발되지 아니한 컴퓨터 바이러스 등의
                    유포나 기타 운영자가 통제할 수 없는 불가항력적 사유로 인한
                    회원의 손해에 대하여 책임지지 않습니다.
                  </p>
                </div>
              </section>

              <section className="mb-4 sm:mb-6 border-b border-gray-200 pb-4 sm:pb-6">
                <h2 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-900">
                  제17조 비회원 구독 서비스
                </h2>
                <div className="space-y-2 sm:space-y-2">
                  <p className="leading-relaxed text-gray-700">
                    ① 비회원 구독자는 이메일 입력을 통해 구독 서비스를 신청할 수
                    있으며, 해당 이메일은 콘텐츠 발송을 위한 목적으로만
                    사용됩니다.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ② 구독 신청 시, 개인정보 수집 및 이용 동의 문구를 확인 후
                    신청 버튼을 클릭함으로써 동의한 것으로 간주합니다.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    ③ 구독자는 언제든지 구독 해지를 요청할 수 있으며, 해지 시
                    등록된 이메일 정보는 지체 없이 파기됩니다.
                  </p>
                </div>
              </section>
            </div>

            <div className="mt-6 sm:mt-8 rounded-lg bg-gray-50 p-4 sm:p-6 text-center">
              <h3 className="mb-2 text-base sm:text-lg font-semibold text-gray-900">부칙</h3>
              <p className="text-sm sm:text-base text-gray-700">
                이 약관은{" "}
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

export default TermsOfService;
