import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Spinner from './spinner/Spinner'

const ContentLoader = () => {
    const { loading, message } = useSelector(({ common }) => common);

    useEffect(() => {
        console.log('loading: ', loading);
    }, [loading]);

    return (
        <>
            {loading && <Spinner message={message} />}
        </>
    )
}

export default ContentLoader