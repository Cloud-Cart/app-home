import {SecondStepForm} from "@/app/(auth)/second-step/SecondStepForm";

type Props = {};

export default function Page(props: Props) {
    return <>
        <div className={'container w-fit h-fit mb-4'}>
            <h3 className={'text-2xl font-bold'}>2-Step Verification</h3>
            <p className={'font-light text-sm text-gray-500'}>Complete your extra layer of security</p>
        </div>
        <SecondStepForm/>
    </>;
};