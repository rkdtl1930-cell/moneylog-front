import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import './Main.css';
import Navi from './Navi';
import Footer from './Footer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Chatbot from './Chatbot';

gsap.registerPlugin(ScrollTrigger);

const ReviewCard = ({ avatar, title, desc }) => (
  <li>
    <div className="top">
      <i>
        <img src={avatar} alt="" />
      </i>
      <p>{title}</p>
    </div>
    <p className="desc">{desc}</p>
  </li>
);

export default function Home() {
  /* 자주 묻는 질문 */
  const [open, setOpen] = useState(null);
  const faq = [
    [
      '회원가입은 꼭 해야 하나요?',
      '네, 본 서비스는 챗봇을 통해 개인 소비 패턴과 기록에 맞춘 기능을 제공하고 있습니다.\n사용자별 데이터 저장 및 맞춤형 분석을 위해 회원 가입은 필수이며, 가입 후에는 보다 안정적이고 연속적인 서비스 이용이 가능합니다.',
    ],
    [
      '데이터는 챗봇 입력은 무료인가요?',
      '현재 본 서비스는 개발 단계의 베타 테스트 기간으로, 챗봇 입력 기능을 무료로 제공하고 있습니다.\n향후 서비스 고도화 및 정책에 따라 이용 방식이 변경될 수 있으며, 변경 사항이 있을 경우 사전에 안내드릴 예정입니다.',
    ],
    [
      '소비 데이터는 안전한가요?',
      '네, 사용자의 소비 데이터는 개인 데이터로 안전하게 저장되며, 외부에 공개되거나 타인이 열람할 수 없습니다.\n또한 관련 법령과 내부 보안 정책을 준수하여 데이터 보호에 최선을 다하고 있습니다.',
    ],
    [
      '가계부 내역은 수정 가능한가요?',
      '네, 가계부 내역은 TALKPAY 웹과 앱 환경 모두에서 자유롭게 수정할 수 있습니다.\n입력 후에도 금액, 날짜, 메모 등을 언제든지 변경할 수 있어 보다 유연한 가계부 관리가 가능합니다.',
    ],
  ];

  /* 리뷰 */
  const reviews = [
    {
      avatar: '/images/landing/person01.png',
      title: '20대 후반 직장인',
      desc: '예전엔 가계부 쓰다가 항상 중간에 포기했어요. 근데 여기는 그냥 결제 내역 적어두면 카테고리랑 월별 분석을 알아서 해줘서 처음으로 한 달을 끝까지 관리했어요. 이번 달엔 제가 커피에 이렇게 많이 쓰는지 처음 알았어요.',
    },
    {
      avatar: '/images/landing/person01.png',
      title: '사회초년생',
      desc: "돈 관리는 뭔가 어려운 사람들만 하는 줄 알았는데 이 서비스 쓰고 나서는 제 소비 습관이 눈에 보이니까 덜 불안해졌어요. 목표 없이 쓰던 돈을 '이 정도면 괜찮다'고 판단할 수 있게 됐어요.",
    },
    {
      avatar: '/images/landing/person01.png',
      title: '다이어트형 소비자',
      desc: '소비를 줄이려고 일부러 참진 않았어요. 근데 매달 분석을 보니까 굳이 안 써도 되는 지출이 보이더라고요. 다음 달엔 그냥 같은 생활을 했는데 지출이 줄어 있어서 신기했어요.',
    },
    {
      avatar: '/images/landing/person01.png',
      title: '감성형 사용자',
      desc: '그냥 금액만 적는 가계부는 재미가 없었는데 여기는 소비 이유를 같이 남길 수 있어서 나중에 보면 그 달의 생활이 떠올라요. 가계부라기보다 제 생활 기록 같아요.',
    },
    {
      avatar: '/images/landing/person01.png',
      title: '프리랜서',
      desc: '프리랜서라 수입이 매달 다른데 항상 체감은 비슷하게 쓰고 있더라고요. 이 가계부로 월별 소비 패턴을 비교해보니까 수입이 많을 때 같이 늘어나는 지출이 보여서 다음 달 계획을 세우기 쉬워졌어요. 이제는 잘 번 달을 그냥 흘려보내지 않아요.',
    },
    {
      avatar: '/images/landing/person01.png',
      title: '무자각 소비형',
      desc: '저는 원래 계획 세우는 걸 싫어해서 가계부도 저랑은 안 맞는다고 생각했어요. 근데 이 서비스는 제가 뭘 줄여야 한다고 말하지 않아서 좋았어요. 그냥 쓰던 대로 썼는데 나중에 보니까 제 소비가 한눈에 보이더라고요. 그 뒤로는 결제하기 전에 한 번 생각하게 됐어요.',
    },
  ];

  const infiniteReviews = [...reviews, ...reviews];

  useEffect(() => {
    /* 블러 이벤트 */
    const blobs = gsap.utils.toArray('.blur');
    blobs.forEach((blob) => {
      const tl = gsap.timeline({
        repeat: -1,
        yoyo: true,
      });

      tl.to(blob, {
        x: gsap.utils.random(-40, 40),
        y: gsap.utils.random(-60, 60),
        scale: gsap.utils.random(0.95, 1.1),
        duration: gsap.utils.random(4, 7),
        ease: 'sine.inOut',
      }).to(blob, {
        x: gsap.utils.random(-60, 60),
        y: gsap.utils.random(-40, 40),
        scale: gsap.utils.random(0.9, 1.15),
        duration: gsap.utils.random(5, 8),
        ease: 'sine.inOut',
      });
    });

    /*애니메이션*/
    // gsap.registerPlugin(ScrollTrigger);
    const fadeUp = (selector, options = {}) => {
      gsap.from(selector, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        ...options,
      });
    };
    const scrollAnim = (selector, options = {}) => {
      const { trigger, start, ...rest } = options;

      gsap.from(selector, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: trigger || selector,
          start: start || 'top 80%',
          // trigger: selector,
          // start: 'top 80%',
        },
        ...rest,
        // ...options,
      });
    };
    fadeUp('.sc01 h1, .sc01 p, .sc01 .yellowBtn', { stagger: 0.2 });
    scrollAnim('.sc02 ul li', { stagger: 0.15 });
    scrollAnim('.sc03 .con01 p', { trigger: '.sc03 .con01', start: 'top 75%' });
    scrollAnim('.sc03 .con01 img', {
      trigger: '.sc03 .con01',
      start: 'top 75%',
      duration: 1.2,
      delay: 0.4,
    });
    scrollAnim('.sc03 .con02 p', { trigger: '.sc03 .con02', start: 'top 75%' });
    gsap.from('.sc03 .con02 img', {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      delay: 0.4,
      ease: 'back.out(1.7)',
      scrollTrigger: { trigger: '.sc03 .con02', start: 'top 75%' },
    });
    scrollAnim('.sc04 ul li', { y: 70, duration: 0.9, stagger: 0.2 });
    scrollAnim('.faq-item', { duration: 0.7, stagger: 0.1, ease: 'power2.out' });
    scrollAnim('.sc06 .marquee', { y: 80, duration: 1, start: 'top 70%' });
    scrollAnim('.sc07 .con', { start: 'top 75%' });
    gsap.utils.toArray('.mainTit').forEach((title) => {
      scrollAnim(title, { trigger: title, start: 'top 85%', duration: 0.9 });
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <>
      <Chatbot />
      <Navi />
      <main id="main">
        <section className="sc01">
          <div className="fix-layout">
            <h1>
              ONE CHAT.
              <br />
              EASY MONEY
            </h1>
            <p>입력 없이, 대화로 소비를 기록하세요</p>
            <a href="/login" className="yellowBtn">
              Try for Free
            </a>
          </div>
        </section>
        <section className="sc02">
          <h2 className="mainTit">
            입력 없이, 고민 없이
            <br />
            챗봇과의 대화로 소비를 기록하고 정리하세요.
          </h2>
          <ul>
            <li>
              <i>
                <img src="/images/landing/ico01.png" alt="" />
              </i>
              <div className="txt">
                <p>기록하기</p>
                <span>“오늘 점심 9천원” 말하듯 입력</span>
              </div>
            </li>
            <li>
              <i>
                <img src="/images/landing/ico02.png" alt="" />
              </i>
              <div className="txt">
                <p>자동 분류</p>
                <span>소비 내역 정리 자동 정리</span>
              </div>
            </li>
            <li>
              <i>
                <img src="/images/landing/ico03.png" alt="" />
              </i>
              <div className="txt">
                <p>대시보드</p>
                <span>내 소비 흐름을 한눈에 확인</span>
              </div>
            </li>
            <li>
              <i>
                <img src="/images/landing/ico04.png" alt="" />
              </i>
              <div className="txt">
                <p>공유하기</p>
                <span>다른 사람들과 소비 이야기를 나눠요</span>
              </div>
            </li>
          </ul>
        </section>
        <section className="sc03">
          <h2 className="mainTit">
            쓰는 게 아니라,대화로 남기세요
            <br />
            항목을 고르고, 고민할 필요 없어요.
          </h2>
          <div className="conBox">
            <div className="con01">
              <p>입력은 간단하게</p>
              <i>
                <img src="/images/landing/mokup01.svg" alt="" />
              </i>
            </div>
            <div className="con02">
              <p>
                정리는 자동으로
                <br />
                기록은 쌓이는 똑똑해지는 가계부
              </p>
              <i>
                <img src="/images/landing/mokup02.png" alt="" />
              </i>
            </div>
          </div>
        </section>
        <section className="sc04">
          <div className="bg-blur">
            <span className="blur blob1" />
            <span className="blur blob2" />
          </div>
          <h2 className="mainTit">
            소비가 쌓일수록
            <br />
            똑똑해지는 나만의 가계부
          </h2>
          <ul>
            <li className="con01">
              <i>
                <img src="/images/landing/ico05.png" alt="" />
              </i>
              <p>MONTHLY</p>
              <span>한 달 동안의 소비를 한눈에 정리해요</span>
            </li>
            <li className="con02">
              <i>
                <img src="/images/landing/ico06.png" alt="" />
              </i>
              <p>CATEGORY</p>
              <span>어디에 얼마나 썼는지 쉽게 확인하세요</span>
            </li>
            <li className="con03">
              <i>
                <img src="/images/landing/ico07.png" alt="" />
              </i>
              <p>PATTERN</p>
              <span>쌓인 기록으로 나의 소비 흐름을 보여드려요</span>
            </li>
          </ul>
        </section>
        <section className="sc05">
          <h2 className="mainTit">자주 묻는 질문</h2>
          <ul className="faq-box">
            {faq.map((v, i) => (
              <li key={i} className={`faq-item ${open === i ? 'open' : ''}`}>
                <div className="faq-title" onClick={() => setOpen(open === i ? null : i)}>
                  <h3>{v[0]}</h3>
                  <span className="icon">
                    <img src="/images/landing/arrowDown.png" alt="" />
                  </span>
                </div>

                <div className="faq-content">
                  {v[1].split('\n').map((line, idx) => (
                    <span key={idx}>
                      {line}
                      <br />
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="sc06">
          <h2 className="mainTit">
            가계부를 포기했던 사람들이
            <br />
            다시 기록을 시작했습니다
          </h2>
          <div className="marquee">
            <ul>
              {infiniteReviews.map((review, i) => (
                <ReviewCard key={i} {...review} />
              ))}
            </ul>
          </div>
        </section>
        <section className="sc07">
          <div className="con">
            <h2 className="mainTit">
              써보는 게 가장 빠릅니다.
              <br />단 한마디로 시작하세요
            </h2>
            <a href="/login" className="yellowBtn">
              채팅 시작
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
