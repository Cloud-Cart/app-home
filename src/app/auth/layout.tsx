import Image from "next/image";

export default function AuthLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <main className={'w-screen h-screen bg-amber-200 flex items-center justify-center'}>
            <div className={'container w-fit h-fit  bg-white rounded-lg p-12 min-w-96'}>
                <Image
                    src="/cloud-cart.svg"
                    alt="Cloud Cart logo"
                    width={100}
                    height={25}
                    priority
                    className={'pb-8'}
                />
                {children}
                <ul className={'flex gap-2 font-light text-xs mt-7'}>
                    <li>Help</li>
                    <li>Privacy</li>
                    <li>Terms</li>
                </ul>
            </div>
        </main>

    );
}