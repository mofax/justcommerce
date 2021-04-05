import Document, { Html, Head, Main, NextScript } from 'next/document'
import { getCssString } from '../tools/stitches'

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html>
                <Head>
                    <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssString() }} />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
