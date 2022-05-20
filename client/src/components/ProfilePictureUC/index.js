import React from 'react'
import './index.scss'
import useWindowDimensions from "services/useWindowDimensions";

const ProfilePictureUC = ({ onChange, hoverText, id, src }) => {
    const { width } = useWindowDimensions();
    const _imgSrc = src ? src : 'https://themesfinity.com/wp-content/uploads/2018/02/default-placeholder-300x300.png';
    return (
        <div className={"profile-pic " + (width < 768 ? ' justify-center' : '')}>
            <label className="-label" htmlFor={"file" + id}>
                <span className="glyphicon glyphicon-camera"></span>
                <span>{hoverText}</span>
            </label>
            <input id={"file" + id} type="file" onChange={onChange} accept="image/*" />
            <img src={_imgSrc} id={id} width="200" />
        </div>
    )
}

export default ProfilePictureUC