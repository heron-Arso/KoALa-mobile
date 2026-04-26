import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-white border-b border-black/8">
        <div className="flex items-center gap-4 px-5 py-4">
          <button onClick={() => navigate(-1)} className="text-black">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold tracking-tight">개인정보처리방침</h1>
        </div>
      </div>

      {/* 본문 */}
      <div className="px-5 py-6 space-y-8 text-sm text-gray-700 leading-relaxed max-w-xl mx-auto">

        <section>
          <p className="text-xs text-gray-400 mb-4">최종 업데이트: 2025년 1월 1일</p>
          <p>
            KoALa(이하 "회사")는 개인정보보호법 등 관련 법령을 준수하며, 이용자의 개인정보를
            안전하게 보호합니다. 본 방침은 회사가 수집하는 개인정보의 항목, 수집 목적, 보유 기간
            등을 안내합니다.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-bold text-black mb-2">1. 수집하는 개인정보 항목</h2>
          <div className="space-y-2">
            <p className="font-medium text-black">필수 항목</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>이름, 이메일 주소, 휴대폰 번호</li>
              <li>비밀번호 (암호화 저장)</li>
              <li>결제 정보 (카드사에서 직접 처리, 당사 미보관)</li>
            </ul>
            <p className="font-medium text-black mt-2">소셜 로그인 시 추가 수집</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>카카오: 닉네임, 이메일</li>
              <li>네이버: 이름, 이메일</li>
            </ul>
            <p className="font-medium text-black mt-2">자동 수집 항목</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>접속 IP, 쿠키, 서비스 이용 기록</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold text-black mb-2">2. 개인정보 수집 및 이용 목적</h2>
          <ul className="space-y-1 list-disc list-inside">
            <li>회원 가입 및 본인 확인</li>
            <li>상품 주문, 결제 및 배송 처리</li>
            <li>고객 문의 및 분쟁 처리</li>
            <li>서비스 개선 및 맞춤형 콘텐츠 제공</li>
            <li>법령상 의무 이행</li>
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-bold text-black mb-2">3. 개인정보 보유 및 이용 기간</h2>
          <div className="space-y-2">
            <ul className="space-y-1 list-disc list-inside">
              <li>회원 정보: 회원 탈퇴 시까지</li>
              <li>거래 기록: 5년 (전자상거래법)</li>
              <li>소비자 불만 기록: 3년 (전자상거래법)</li>
              <li>접속 로그: 3개월 (통신비밀보호법)</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold text-black mb-2">4. 개인정보의 제3자 제공</h2>
          <p>
            회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 단, 아래의 경우
            예외로 합니다.
          </p>
          <ul className="space-y-1 list-disc list-inside mt-2">
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령의 규정에 따른 경우</li>
            <li>배송을 위한 택배사 정보 제공 (수령인 정보에 한함)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-bold text-black mb-2">5. 개인정보 처리 위탁</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 font-medium text-black">수탁업체</th>
                  <th className="text-left py-2 font-medium text-black">위탁 업무</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2 pr-4">토스페이먼츠</td>
                  <td className="py-2">결제 처리</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Amazon Web Services</td>
                  <td className="py-2">서버 인프라 운영</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold text-black mb-2">6. 이용자의 권리</h2>
          <p>이용자는 언제든지 다음의 권리를 행사할 수 있습니다.</p>
          <ul className="space-y-1 list-disc list-inside mt-2">
            <li>개인정보 열람 요청</li>
            <li>개인정보 수정·삭제 요청</li>
            <li>개인정보 처리 정지 요청</li>
            <li>회원 탈퇴 (앱 내 마이페이지에서 가능)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-bold text-black mb-2">7. 쿠키 사용</h2>
          <p>
            회사는 서비스 편의를 위해 쿠키를 사용합니다. 인증 토큰은 HttpOnly 쿠키로 저장되어
            XSS 공격으로부터 보호됩니다. 브라우저 설정을 통해 쿠키를 거부할 수 있으나 일부
            서비스 이용이 제한될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-bold text-black mb-2">8. 개인정보 보호 책임자</h2>
          <div className="bg-gray-50 rounded-xl p-4 space-y-1 text-xs">
            <p><span className="font-medium text-black">책임자:</span> KoALa 개인정보 보호팀</p>
            <p><span className="font-medium text-black">이메일:</span> privacy@koala-art.co.kr</p>
            <p><span className="font-medium text-black">처리 기간:</span> 접수 후 영업일 3일 이내</p>
          </div>
        </section>

        <div className="pt-4 pb-8 text-xs text-gray-400 text-center">
          본 방침은 2025년 1월 1일부터 시행됩니다.
        </div>
      </div>
    </div>
  );
}
