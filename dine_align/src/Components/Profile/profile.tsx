import React, { useState, useEffect } from "react";
import style from "./profile.module.css"
import defaultPfp from "./DefaultPFP.jpg"

function Profile() {

    return (
        <div className={style.container}>
            {/* <!-- Cover Photo and Profile Picture --> */}
            <div className={style.coverPhoto}>
                <div className={style.profilePhoto}>
                    <img src={defaultPfp} alt="Profile Photo"/>
                </div>
            </div>

            {/* <!-- User Info Section --> */}
            <div className={style.userInfo}>
                <h1>John Doe</h1>
                <p>Web Developer | Music Enthusiast | Travel Lover</p>
                <button className={style.addFriendBtn}>Add Friend</button>
                <button className={style.messageBtn}>Message</button>
            </div>

            {/* <!-- Friends and Posts Section --> */}
            <div className={style.mainContent}>
                {/* <!-- Friends List --> */}
                <div className={style.friendsSection}>
                    <h2>Friends</h2>
                    <div className={style.friendsList}>
                        <div className={style.friend}>
                            <img src="friend1.jpg" alt="Friend 1"/>
                            <p>Jane Smith</p>
                        </div>
                        <div className={style.friend}>
                            <img src="friend2.jpg" alt="Friend 2"/>
                            <p>Michael Brown</p>
                        </div>
                        {/* <!-- Add more friends as needed --> */}
                    </div>
                </div>

                {/* <!-- Posts Section --> */}
                <div className={style.postsSection}>
                    <h2>Posts</h2>
                    <div className={style.post}>
                        <p>Just came back from an amazing trip!</p>
                    </div>
                    <div className={style.post}>
                        <p>Excited to work on new projects!</p>
                    </div>
                    {/* <!-- Add more posts as needed --> */}
                </div>
            </div>
        </div>
    );
}

export default Profile;