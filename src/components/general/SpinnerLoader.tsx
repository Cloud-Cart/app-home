type Props = {
    fill: string,
    width: string,
    height: string
};

export const SpinnerLoader = (props: Props) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width={props.width} height={props.height}>
            <radialGradient id="a5" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)">
                <stop offset="0" stopColor={props.fill}></stop>
                <stop offset=".3" stopColor={props.fill} stopOpacity=".9"></stop>
                <stop offset=".6" stopColor={props.fill} stopOpacity=".6"></stop>
                <stop offset=".8" stopColor={props.fill} stopOpacity=".3"></stop>
                <stop offset="1" stopColor={props.fill} stopOpacity="0"></stop>
            </radialGradient>
            {/* @ts-expect-error: Can't remove transform origin */}
            <circle transformOrigin="center" fill="none" stroke="url(#a5)" strokeWidth="30" strokeLinecap="round"
                    strokeDasharray="200 1000" strokeDashoffset="0" cx="100" cy="100" r="70">
                <animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="360;0"
                                  keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform>
            </circle>
            {/* @ts-expect-error: Can't remove transform origin */}
            <circle transformOrigin="center" fill="none" opacity=".2" stroke={props.fill} strokeWidth="30"
                    strokeLinecap="round" cx="100" cy="100" r="70"></circle>
        </svg>
    );
};