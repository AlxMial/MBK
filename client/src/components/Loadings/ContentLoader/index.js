import React from 'react'
import { useSelector } from 'react-redux'
import Spinner from '../spinner/Spinner';

const ContentLoader = () => {
    const { loading, message } = useSelector(({ common }) => common);

    return (
        <>
            {loading && <Spinner message={message} />}
        </>
    )
}

export default ContentLoader