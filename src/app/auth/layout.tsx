import Image from "next/image";

export default function AuthLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Auth</title>
        </head>
        <body>
        <main className={'w-screen h-screen bg-amber-200 flex items-center justify-center'}>
            <div
                className={'container w-full sm:w-2/3 md:w-1/3 h-full sm:h-fit  bg-white rounded-lg p-7 sm:p-12 min-w-80'}>
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

        </body>
        </html>
    );
}