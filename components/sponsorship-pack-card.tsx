import React, { FC, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@material-tailwind/react";
import { transferCUSD } from "@/utils/transactions";
import { useAccount } from "wagmi";
import { useSponsorTournamentMutation } from "@/redux/services/sponsor-tournament";

interface IProps {
  tier: string;
  title: string;
  perks: {
    id: number;
    tournament_package_id: number;
    description: string;
    created_at: string;
    updated_at: string;
  }[];
  sponsorshipAmount: string;
  tournament_id: string;
  sponsor_id: string;
  tournament_package_id: string;
}

const SponsorshipPackCard: FC<IProps> = ({
  tier,
  title,
  perks,
  sponsorshipAmount,
  tournament_id,
  sponsor_id,
  tournament_package_id,
}) => {
  const { back } = useRouter();

  // Holds User Address accessed from wagmi
  const [userAddress, setUserAddress] = useState<string>("");

  // Sponsoring Button Indicator
  const [isSponsoring, setIsSponsoring] = useState<boolean>(false);

  // Get Wallet address and Connected status
  const { address, isConnected } = useAccount();

  // Get User Address When wallet is connected
  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address!);
    }
  }, [address, isConnected]);

  // API Mutation for sponsoring Tournament
  const [sponsorTournament, { data, isSuccess, isError }] =
    useSponsorTournamentMutation();

  // Handle Sponsor Tournament
  const handleSponsorTournament = async () => {
    setIsSponsoring(true);
    await transferCUSD({ userAddress: userAddress })
      .then(() => {
        sponsorTournament({
          tournament_id: tournament_id,
          sponsor_id: sponsor_id,
          tournament_package_id: tournament_package_id,
        })
          .then(() => {
             setIsSponsoring(false);
            back();
          })
          .catch((err: any) => {
             setIsSponsoring(false);
            alert(`${err}`);
          });
      })
      .catch((err) => {
        alert(`ERROR: ${err}`);
      });
  };

  return (
    <div className='w-[280px] h-[390px] bg-black px-[23px] space-y-[12px] py-[21px] rounded-[25px] shadow-[0px_4px_50px_20px_rgba(0,182,85,0.15)]'>
      {/* Tier */}
      <div className='w-full flex items-center justify-center text-white text-[1.5rem] font-[900]'>
        {tier}
      </div>

      {/* Details */}
      <div className='h-[194px] space-y-[12px] pb-[12px] border-b-[1px] border-dashed border-b-white'>
        <div className='w-full flex flex-col items-center gap-y-[16px]'>
          {/* Title */}
          <h5 className='w-full flex items-center justify-start text-white text-[0.87rem] text-left font-[400]'>
            {title}
          </h5>

          {/* Perks */}
          {perks?.map((perk, idx) => (
            <div key={idx} className='w-full flex items-center space-x-[6px]'>
              <span>
                <svg
                  width='16'
                  height='17'
                  viewBox='0 0 16 17'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M7.97829 1.55664C4.31273 1.55664 1.33057 4.53881 1.33057 8.20436C1.33057 11.8699 4.31273 14.8521 7.97829 14.8521C11.6438 14.8521 14.626 11.8699 14.626 8.20436C14.626 4.53881 11.6438 1.55664 7.97829 1.55664ZM6.64941 11.138L4.18111 8.67502L5.11977 7.7337L6.64808 9.25936L10.1674 5.74005L11.1074 6.68004L6.64941 11.138Z'
                    fill='white'
                  />
                </svg>
              </span>
              {/* perk */}
              <p className='text-white text-[0.6rem] font-[400]'>
                {perk?.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Amount payout */}
      <div className='w-full space-y-[14px]'>
        {/* Payout */}
        <div className='flex flex-col items-center justify-start gap-[14px]'>
          <div className='text-white text-[1.3rem] self-start text-left font-[700]'>
            cUSD{sponsorshipAmount}
          </div>
          {/* More Button */}
          <Button
            placeholder='More'
            ripple={true}
            onClick={() => handleSponsorTournament()}
            disabled={isSponsoring}
            className='text-white text-[0.87rem] bg-green w-[170px] h-[40px] flex items-center justify-center text-center rounded-[5px]'
          >
            {isSponsoring ? "Sponsoring..." : "Sponsor"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SponsorshipPackCard;
