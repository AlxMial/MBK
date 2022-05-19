import React from 'react'
import './index.scss'

const ProfilePictureUC = ({ onChange, hoverText, id }) => {
    return (
        <div className="profile-pic">
            <label className="-label" htmlFor={"file" + id}>
                <span className="glyphicon glyphicon-camera"></span>
                <span>{hoverText}</span>
            </label>
            <input id={"file" + id} type="file" onChange={onChange} accept="image/*" />
            <img src="https://themesfinity.com/wp-content/uploads/2018/02/default-placeholder-300x300.png" id={id} width="200" />
        </div>
    )
}

export default ProfilePictureUC