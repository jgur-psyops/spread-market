import { Link } from "react-router-dom";

const landingBg =
  "linear-gradient(to bottom right, rgba(199, 42, 183, 0.20) 0%, rgba(42, 171, 180, 0.20) 20%, rgba(237, 214, 5, 0.20) 50%) bottom right / 50% 50% no-repeat, linear-gradient(to bottom left, rgba(199, 42, 183, 0.20) 0%, rgba(42, 171, 180, 0.20) 20%, rgba(237, 214, 5, 0.20) 50%) bottom left / 50% 50% no-repeat, linear-gradient(to top left, rgba(199, 42, 183, 0.20) 0%, rgba(42, 171, 180, 0.20) 20%, rgba(237, 214, 5, 0.20) 50%) top left / 50% 50% no-repeat, linear-gradient(to top right, rgba(199, 42, 183, 0.20) 0%, rgba(42, 171, 180, 0.20) 20%, rgba(237, 214, 5, 0.20) 50%) top right / 50% 50% no-repeat, radial-gradient(72.74% 40.15% at 85.56% 81.35%, rgba(24, 20, 188, 0.20) 0%, rgba(251, 40, 255, 0.20) 52.5%, rgba(170, 16, 16, 0.20) 100%), radial-gradient(140.63% 111.8% at 0% 0%, #8432C5 0%, rgba(16, 177, 148, 0.96) 41.5%, #020068 100%)";
export const Landing = () => {
  return (
    <div
      className="w-full h-full flex flex-col items-center  bg bg-cover bg-center bg-no-repeat bg-fixed min-h-[100vh]"
      style={{
        //backgroundImage: "url(/assets/LandingBg.png)",
        background: landingBg,
      }}
    >
      <div className="w-full h-full flex flex-col items-center justify-center max-w-[1200px] mb-50px">
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
    <div className="w-full h-full flex flex-col items-center justify-center mt-[125px] mb-[20px]">
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
        <img
          className="smiley-toast-animation"
          src="/assets/toasty2.svg"
          alt="Smiley Toast"
        />
      </div>
    </div>
  );
};

export const HowItWorks = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-10">
      <div className=" flex-col justify-start items-start gap-2.5 inline-flex">
        <div className="whitespace-nowrap text-center text-white text-opacity-97 text-6xl font-bold font-['Poppins'] leading-10">
          How does it work?
        </div>
        <div className="text-center text-lg font-medium font-['Inter']">
          {/* TODO LOREM IPSUM */}
        </div>
      </div>
      <hr className="hr-line-break"></hr>
      <div className="w-full justify-around items-center inline-flex">
        <HowItWorksCard
          title="Fly like a metal bird"
          textBody="Your assets fly like an Eagle (well, like a Condor anyways)."
          imageFileName="iron-condor.svg"
          link1={{ href: "/vaultList", title: "Get Started" }}
          link2={{ href: "/vaultList", title: "Learn More" }}
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
type LinkProps = {
  href: string;
  title: string;
};
export const HowItWorksCard = ({
  title,
  textBody,
  imageFileName,
  link1,
  link2,
}: {
  title: string;
  textBody: string;
  imageFileName: string;
  link1?: LinkProps;
  link2?: LinkProps;
}) => {
  return (
    <div className="w-[calc(35vmin)] p-7 bg-gradient-to-b from-indigo-400 to-slate-900 rounded-2xl flex-col justify-start items-start gap-6 inline-flex self-stretch">
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
        {link1 && (
          <div className="px-3 py-2.5 rounded-lg border border-slate-400 justify-center items-center gap-1 flex">
            <div className="justify-start items-center gap-2.5 flex">
              <Link to={link1?.href} className="text-inherit">
                <div className="text-center text-slate-300 text-sm font-bold font-['Inter'] leading-none">
                  {link1?.title}
                </div>
              </Link>
            </div>
          </div>
        )}
        {link2 && (
          <div className="px-3 py-2.5 bg-indigo-100 rounded-lg shadow border border-indigo-300 justify-center items-center gap-1 flex">
            <div className="justify-start items-center gap-2.5 flex">
              <Link to={link2.href}>
                <div className="text-center text-slate-900 text-sm font-bold font-['Inter'] leading-none">
                  {link2.title}
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ConnectWithUs = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center"></div>
  );
};
