import {SecondStepForm} from "@/app/(no-auth)/second-step/SecondStepForm";


export default function Page() {
    return <>
        <div className={'container w-fit h-fit mb-4'}>
            <h3 className={'text-2xl font-bold'}>2-Step Verification</h3>
            <p className={'font-light text-sm text-gray-500'}>Complete your extra layer of security</p>
        </div>
        <SecondStepForm/>
    </>;
};