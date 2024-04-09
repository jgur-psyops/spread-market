import { Link } from "react-router-dom";

export const Landing = () => {
  return (
    <div
      className="w-full h-full flex flex-col items-center  bg bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url(/assets/LandingBg.png)" }}
    >
      <div className="w-full h-full flex flex-col items-center justify-center max-w-[1200px]">
        <Hero />
        <HowItWorks />
        <ConnectWithUs />
      </div>
    </div>
  );
};

/* text-shadow: 3px 5px 4px #8432C5;
font-family: Slackey;
font-size: 60px;
font-style: normal;
font-weight: 400;
line-height: normal;
letter-spacing: 6px;
background: linear-gradient(180deg, #DD7F40 0%, #FCFCFF 100%);
background-clip: text;
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
 */
const titleStyle = {
  textShadow: "3px 5px 4px #8432C5",
  fontFamily: "Slackey",
  fontSize: "50px",
  fontStyle: "normal",
  fontWeight: "400",
  lineHeight: "normal",
  letterSpacing: "6px",
  whiteSpace: "nowrap",
  background: "linear-gradient(180deg, #DD7F40 0%, #FCFCFF 100%)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  //WebkitTextFillColor: "transparent",
};
/*
text-shadow: 0px -3px 3px rgba(255, 1, 245, 0.48), 0px 0px 6px #6465FF, 0px 0px 17px rgba(255, 255, 255, 0.30);
font-family: Poppins;
font-size: 46px;
font-style: normal;
font-weight: 700;
line-height: 125%; 
background: linear-gradient(180deg, #FBFBFF 50%, #D4CDFF 77.58%);
background-clip: text;
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
 */
const subTitleStyle = {
  textShadow:
    "0px -3px 3px rgba(255, 1, 245, 0.48), 0px 0px 6px #6465FF, 0px 0px 17px rgba(255, 255, 255, 0.30)",
  fontFamily: "Poppins",
  fontSize: "46px",
  fontStyle: "normal",
  fontWeight: "700",
  lineHeight: "125%",
  background: "linear-gradient(180deg, #FBFBFF 50%, #D4CDFF 77.58%)",
  backgroundClip: "text",
  whiteSpace: "nowrap",
  WebkitBackgroundClip: "text",
  //WebkitTextFillColor: "transparent",
};

export const Hero = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center mt-[145px] mb-[20px]">
      <div className="w-full flex items-center justify-around ">
        <div className="flex-col justify-center items-center gap-10 inline-flex py-10">
          <div style={titleStyle}>sBREAD FINANCE</div>
          <div className="self-stretch flex-col justify-start items-start gap-1 flex">
            <div className=" h-14  whitespace-nowrap">
              <div className="text-center text-white text-5xl font-medium font-['Poppins'] leading-10">
                Bad Yields on Defi{" "}
              </div>
            </div>
            <div className="self-stretch justify-center items-center inline-flex">
              <img
                className="w-24 h-24 origin-top-left"
                src="/assets/LeftTitleSpread.png"
              />
              <div style={subTitleStyle}> are Toast</div>
              <img
                className="w-24 h-24 origin-top-left "
                src="/assets/RightTitleSpread.png"
              />
            </div>
            <div className="self-stretch justify-start items-center gap-2.5 inline-flex">
              <div className="text-right text-white text-5xl font-medium font-['Poppins'] leading-10">
                {" "}
                with sBread Markets
              </div>
            </div>
          </div>
          <div className="self-stretch h-14 flex-col justify-center items-center gap-2.5 flex">
            <div className="px-4 py-4 bg-gradient-to-b from-white to-indigo-100 rounded-lg shadow border border-indigo-300 justify-center items-center gap-1 inline-flex">
              <div className="justify-start items-center gap-2.5 flex">
                <div className="text-center text-slate-900 text-lg font-bold font-['Inter'] leading-snug">
                  <Link to="/vaultList">Get Started</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <img className="smiley-toast-animation" src="/assets/toasty.svg" alt="Smiley Toast" />
      </div>
    </div>
  );
};

export const HowItWorks = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="h-28 flex-col justify-start items-start gap-2.5 inline-flex">
        <div className="whitespace-nowrap text-center text-white text-opacity-97 text-6xl font-bold font-['Poppins'] leading-10">
          How does it work?
        </div>
        <div className="text-center text-lg font-medium font-['Inter']">
          {/* TODO LOREM IPSUM */}
        </div>
      </div>
      <hr className="hr-line-break"></hr>
      <div className="w-full h-80 justify-around items-center inline-flex">
        <HowItWorksCard
          title="Fly like a metal bird"
          textBody="Your assets fly like an Eagle (well, like a Condor anyways)."
          imageFileName="iron-condor.svg"
        />
        <HowItWorksCard
          title="Profit off volatility, don't cry about it."
          textBody="Never leave the comfort of your stablecoins."
          imageFileName="iron-condor.svg"
        />
      </div>
    </div>
  );
};

export const HowItWorksCard = ({
  title,
  textBody,
  imageFileName,
}: {
  title: string;
  textBody: string;
  imageFileName: string;
}) => {
  return (
    <div className="w-96 p-7 bg-gradient-to-b from-indigo-400 to-slate-900 rounded-2xl flex-col justify-start items-start gap-6 inline-flex">
      <div className="flex-col justify-start items-start gap-5 flex">
        <div className="text-center text-white text-base font-semibold font-['Poppins'] leading-tight">
          {title}
        </div>
      </div>
      <div className="self-stretch flex-col justify-start items-start gap-5 flex">
        <div className="self-stretch">
          {textBody}
          <img className="mt-4" src={`/assets/${imageFileName}`} alt="" />
        </div>
      </div>
      <div className="justify-center items-center gap-5 inline-flex">
        <div className="px-3 py-2.5 rounded-lg border border-slate-400 justify-center items-center gap-1 flex">
          <div className="justify-start items-center gap-2.5 flex">
            <div className="text-center text-slate-300 text-sm font-bold font-['Inter'] leading-none">
              Read more
            </div>
          </div>
        </div>
        <div className="px-3 py-2.5 bg-indigo-100 rounded-lg shadow border border-indigo-300 justify-center items-center gap-1 flex">
          <div className="justify-start items-center gap-2.5 flex">
            <div className="text-center text-slate-900 text-sm font-bold font-['Inter'] leading-none">
              Stake now
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ConnectWithUs = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center"></div>
  );
};
