import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DataSparkline from "../../../table/currenciesTable/dataSparkline.jsx";
import HoldingCoinTable from "../../../table/holdingCoinsTable/holdingCoinsTable.jsx";
import { useAuth } from "../../../../AuthContext.js";
import { mockWallet } from "../../../../../public/mockData.jsx";
import "./dashboard.css";

export default function Dashboard() {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [walletData, setWalletData] = useState([]);

  useEffect(() => {
    // Set the document title when the component mounts
    document.title = "Dashboard - Crypto Pulse";

    setWalletData(mockWallet);

    // Optional: Clean up function to set the document title back when the component unmounts
    return () => {
      document.title = "Crypto Pulse";
    };
  }, []);

  function copyUserId() {
    navigator.clipboard
      .writeText(currentUser.uid)
      .then(() => {
        // Show the tooltip
        const tooltip = document.getElementById("tooltip");
        tooltip.style.visibility = "visible";

        // Hide the tooltip after 2 seconds
        setTimeout(() => {
          tooltip.style.visibility = "hidden";
        }, 1500);
      })
      .catch((err) => {
        console.error("Error in copying text: ", err);
      });
  }

  const balance = [
    1.226274489530142, 1.2357057443527313, 1.2267307602508846,
    1.2391224847625466, 1.2213900815685885, 1.2285777361678496,
    1.2179869136020518, 1.2242207705290942, 1.2218073305850043,
    1.218661961198569, 1.2211697735735145, 1.2282596313962435,
    1.235370003765751, 1.2474525399905294, 1.2247158476357403,
    1.2057166534805122, 1.1988412661183925, 1.2108178750165353,
    1.2031796164068624, 1.1845444300241086, 1.197488776645696,
    1.2020853481310645, 1.1864345656677502, 1.187015147105824,
    1.203006184240534, 1.1994694422658838, 1.203141869253972,
    1.2221490622068472, 1.2120382889848331, 1.1957944332396409,
    1.1944900731166805, 1.2074674333411968, 1.178455932965367,
    1.194483596019394, 1.2064239987124905, 1.2155247044306177,
    1.2258633634487675, 1.220676330175139, 1.2289471300743564,
    1.240530099747331, 1.2521916982612729, 1.3545624448940747,
    1.386768935201205, 1.3740478628971036, 1.4100747942958587,
    1.3881366795209003, 1.3044126553749018, 1.3083245915563657,
    1.3138174651978063, 1.3197361689871165, 1.3149936247682696,
    1.3167239179543628, 1.3188929341364994, 1.3230555158445594,
    1.3241392233729916, 1.3071376031583237, 1.3181092854014618,
    1.318006717320129, 1.2950213574876897, 1.287157963481544,
    1.2878757397685672, 1.2870337495774269, 1.2838521846768265,
    1.2746081317592628, 1.2861952971860449, 1.2925633305681798,
    1.2997769620620558, 1.3170528953417648, 1.3081063440812644,
    1.3247562997927624, 1.3373732606993702, 1.3529825111310056,
    1.3679593309395857, 1.3841740138614422, 1.3783731345960797,
    1.3831537114485757, 1.3898332072837094, 1.3789066656428366,
    1.3977566551573495, 1.4424684313212393, 1.476906444473768,
    1.4892644257744116, 1.4875901290107705, 1.4669115188190527,
    1.4390967673610013, 1.4501331423088524, 1.4156269500097414,
    1.4286740618993028, 1.3743187628213664, 1.408038643050438,
    1.4153265681275244, 1.4351325001163462, 1.431000796156957,
    1.4728393091912548, 1.7327786987993428, 1.623492243728043,
    1.636347186691569, 1.6589218131336116, 1.6935112882185717,
    1.6925058514861546, 1.691442275926507, 1.674187860277546, 1.801151054870642,
    1.8964290033005395, 2.144627371358895, 2.113532368541581,
    2.1057873200809376, 2.1070200872622387, 2.1034020201198746,
    2.1249530117930076, 2.15959820680456, 2.212375732980879, 2.184837508954367,
    2.1935733449653303, 1.9984302509569765, 2.0461143303762803,
    2.039828003831076, 2.0234176855620833, 1.9967363435823302,
    2.023214683951394, 2.0337404338716842, 1.9928904741630458,
    1.9536754819228488, 1.9235134763277377, 1.9293925042628584,
    1.9027122961798657, 1.8544400187832417, 1.9248055103642692,
    1.9235399249488208, 1.9510374854977364, 1.9574366663740317,
    1.9894387961782158, 1.9771877582828676, 1.9742737806999984,
    1.926897452865449, 1.9560955614174576, 1.94830653690029, 1.9227593343347635,
    1.9065974070065956, 1.9396281823229113, 2.044361015393398,
    2.018473309870529, 1.9780121910847777, 2.037571484943247,
    1.9712831448966983, 1.9488542072276538, 1.9242368527652314,
    1.9315020677897565, 1.924110238571896, 1.9278396705008523,
    1.9274795853595612, 1.878681097501269, 1.8757904242916676,
    1.8878483676174118, 1.8914583245741885, 1.8971087654596415,
    1.9047088188506698, 1.8801330259993259, 1.8578375457417933,
    1.8658577024057241, 1.8660401251791698, 1.8934476720442817,
    1.8751260795975886, 1.8638509472693794, 1.8774141570270337,
    1.8713356636252623, 1.8797481830788594, 1.8602786166801757,
  ];

  return (
    <div className="m-2 md:m-5 text-slate-950 dark:text-white flex flex-col items-center gap-5 md:gap-10">
      <div className="flex divide-x gap-5 w-full md:w-[70%]">
        <div className="flex justify-center items-center">
          <i className="material-icons" style={{ fontSize: "100px" }}>
            account_circle
          </i>
          <h1 className="text-3xl font-bold ml-2">{currentUser.displayName}</h1>
        </div>

        <div className="hidden md:flex justify-center items-center pl-5 gap-5">
          <div className="w-full">
            <h5 className="font-semibold text-gray-400">User ID</h5>
            <div className="flex justify-center items-center gap-2">
              {currentUser.uid}
              <button
                id="copyButton"
                onClick={copyUserId}
                className="material-icons text-sm text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400"
              >
                content_copy
              </button>
            </div>
            <div
              id="tooltip"
              className="tooltip bg-gray-200 dark:bg-gray-600 font-medium text-sm"
            >
              UserID Copied!
            </div>
          </div>
          <div className="w-full">
            <h5 className="font-semibold text-gray-400">Email</h5>
            <p>{currentUser.email}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start md:border w-full md:w-[70%] dark:border-gray-500 md:rounded-lg p-2 md:p-5">
        <div className="flex flex-col w-full">
          <h2 className="mb-5 text-xl font-bold">Estimated Balance</h2>
          <div className="mb-5 flex items-end">
            <h2 className="text-3xl font-bold me-3">0.00019735</h2>
            <div className="flex items-center">
              BTC
              <i className="material-icons text-sm text-gray-500 dark:text-gray-300">
                expand_more
              </i>
            </div>
          </div>
          <h2 className="mb-5 text-md">≈ $13.93</h2>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between font-semibold mb-2 gap-3">
            <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 w-full py-2 px-4 rounded-lg">
              Deposit
            </button>
            <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 w-full py-2 px-4 rounded-lg">
              Withdraw
            </button>
            <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 w-full py-2 px-4 rounded-lg">
              Cash In
            </button>
          </div>
          <DataSparkline data={balance} width={400} height={100} />
        </div>
      </div>
      <div className="flex flex-col justify-between items-start w-full md:w-[70%] md:border dark:border-gray-500 md:rounded-lg p-2 md:p-5">
        <h2 className="mb-5 text-xl font-bold">Holding</h2>
        <HoldingCoinTable data={walletData} />
      </div>
    </div>
  );
}
