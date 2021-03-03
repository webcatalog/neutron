/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import gravatar from 'gravatar';

import firebase, { db } from '../../firebase';

import defaultAvatarPng from '../../images/default-avatar.png';

import {
  SET_USER_STATE,
  SET_PUBLIC_PROFILE,
  CLEAR_USER_STATE,
} from '../../constants/actions';

export const clearUserState = () => (dispatch) => {
  dispatch(({
    type: CLEAR_USER_STATE,
  }));
};

export const updateUserState = (updatedState) => ({
  type: SET_USER_STATE,
  updatedState,
});

export const setPublicProfile = (publicProfile) => ({
  type: SET_PUBLIC_PROFILE,
  publicProfile,
});

export const updateUserAsync = () => async (dispatch, getState) => {
  const { currentUser } = firebase.auth();
  const currentUserState = getState().user;

  if (!currentUser) return Promise.resolve();

  dispatch(updateUserState({
    isSignedIn: true,
    uid: currentUser.uid,
    email: currentUser.email,
    displayName: currentUser.displayName,
    photoURL: currentUserState.photoURL
      || currentUser.photoURL
      || gravatar.url(currentUser.email, { s: '192', r: 'pg', d: 'retro' }, true)
      || defaultAvatarPng,
    providerData: currentUser.providerData,
  }));

  return Promise.resolve()
    .then(async () => {
      const profileRef = db.collection('editableProfiles').doc(currentUser.uid);
      const profileDocSnapshot = await profileRef.get();
      const profile = profileDocSnapshot.data();
      let uploadedPhoto;
      if (profile && profile.photoPath) {
        const storageRef = firebase.storage().ref(profile.photoPath);
        uploadedPhoto = await storageRef.getDownloadURL();
      }
      dispatch(updateUserState({
        photoURL: uploadedPhoto
          || currentUser.photoURL
          || gravatar.url(currentUser.email, { s: '192', r: 'pg', d: 'retro' }, true)
          || defaultAvatarPng,
      }));
    })
    // eslint-disable-next-line no-console
    .catch(console.log);
};
