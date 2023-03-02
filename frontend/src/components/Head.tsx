import React from "react";

import {Helmet} from "react-helmet";

const Head = (props) => {
    return <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{props.title}</title>
        <link rel="canonical" href={`${window.location.hostname}:${window.location.port}`} />
        <meta http-equiv="Cache-Control" content="max-age: 31536000, no-cache, no-store, must-revalidate" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="0" />

        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='anonymous'/>
        <link rel="preconnect" href="https://cdnjs.cloudflare.com/ajax/libs" crossOrigin='anonymous'/>

        <meta id="meta-description" name="description" content="Zoo admin description." />
    </Helmet>;
};

export default Head;