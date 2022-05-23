import React from 'react'
import './index.scss'
import useWindowDimensions from "services/useWindowDimensions";

const ProfilePictureUC = ({ onChange, hoverText, id, src, className = '' }) => {
    const { width } = useWindowDimensions();
    const _imgSrc = src ? src : require('../../assets/img/mbk/no-image.png').default;
    return (
        <div className={"profile-pic " + (width < 768 ? ' justify-center' : '') + ' ' + className}>
            <label className="-label" htmlFor={"file" + id}>
                <span className="glyphicon glyphicon-camera"></span>
                <span className='text-center'>{hoverText}</span>
            </label>
            <input id={"file" + id} type="file" onChange={onChange} accept="image/*" />
            <img src={_imgSrc} id={id} width="200" />
        </div>
    )
}

export default ProfilePictureUC