import React from 'react'
import './index.scss'

const ProfilePictureUC = ({ handleChangeImg, hoverText }) => {
    return (
        <div className="profile-pic">
            <label className="-label" htmlFor='file'>
                <span className="glyphicon glyphicon-camera"></span>
                <span>{hoverText}</span>
            </label>
            <input id="file" type="file" onChange={handleChangeImg} accept="image/*" />
            <img src="https://themesfinity.com/wp-content/uploads/2018/02/default-placeholder-300x300.png" id="output" width="200" />
        </div>
    )
}

export default ProfilePictureUC