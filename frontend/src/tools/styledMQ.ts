const xs = 320;
const sm = 740;
const md = 980;
const lg = 1300;

enum Breakpoints {
    XS = 320,
    SM = 740,
    MD = 980,
    LG = 1300,
}

export enum BreakpointsString {
    XS = 'XS',
    SM = 'SM',
    MD = 'MD',
    LG = 'LG'
}

const StyledMQ = (params: {breakpoint: BreakpointsString, rules: string}[]) => {
  
    let MQstring = '';

    for (const item of params) {
MQstring += `\n@media only screen and (min-width: ${Breakpoints[item.breakpoint]}px)
{
${item.rules}
}`;
    }

    return MQstring;
}

export default StyledMQ;