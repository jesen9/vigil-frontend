import Document, { Html, Head, Main, NextScript } from 'next/document';
import React, { Component } from 'react';
// import { ServerStyleSheets } from '@material-ui/styles';
// import { ServerStyleSheet } from 'styled-components';
// import { CacheProvider } from '@emotion/react';
// import createEmotionServer from '@emotion/server/create-instance';
import createEmotionCache from '../utils/createEmotionCache';
import { extractCss } from 'goober'


const csp = process.env.CSP;
const nonce = process.env.NONCE;

class MyDocument extends Document {
    render() {
        const css = this.props.gooberCss;
        
        return (
            <Html lang="en">
                <Head nonce={nonce}>
                    <meta property='csp-nonce' content={nonce} />
                    <meta httpEquiv='Content-Security-Policy' content={csp} />
                    <meta name="emotion-insertion-point" content="" />
                    {/* {this.props.emotionStyleTags} */}
                    <style 
                        id='_goober'
                        nonce={nonce}
                        dangerouslySetInnerHTML={{ __html: ' ' + css }}
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript nonce={nonce} />
                </body>
            </Html>
        )
    }
}

MyDocument.getInitialProps =  async( ctx ) => {
    if (process.env.NODE_ENV !== 'development') {
        const originalRenderPage = ctx.renderPage;
        const cache = createEmotionCache();

        ctx.renderPage = () =>
            originalRenderPage({
                enhanceApp: (App) =>
                    function EnhanceApp(props) {
                        return <App emotionCache={cache} {...props} />;
                    },
            });

        const initialProps = await Document.getInitialProps(ctx);

        // get rendered goober style element
        const gooberCss = extractCss()

        return {
            ...initialProps,
            gooberCss,
        };
        
    } else {
        const initialProps = await Document.getInitialProps(ctx);
        
        return {
            ...initialProps,
        };
    }
}

export default MyDocument
