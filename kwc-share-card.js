/**
`kwc-share-card`
Display a creation made with Kano Code.

@demo demo/index-card.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-image/iron-image.js';
import '@kano/kwc-style/kwc-style.js';
import './assets/svgs.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style>
            :host *[hidden] {
                display: none !important;
            }
            .wrapper {
                display: block;
                width: 100%;
                font-family: var(--font-body);
            }
            .cover {
                position: relative;
                margin-bottom: 14px;
                width: 100%;
            }
            .cover .avatar {
                position: absolute;
                bottom: -10px;
                left: 16px;
                height: 40px;
                width: 40px;
                border-radius: 100%;
                border: 4px solid white;
                cursor: pointer;
                background: #5A6675;
            }
            .title,
            .username {
                cursor: pointer;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 100%;
            }
            .username .username-text,
            .title .title-text {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .title {
                font-size: 24px;
                line-height: 26px;
                margin-bottom: 8px;
                font-weight: bold;
                @apply --layout-horizontal;
            }
            .title .title-text {
                margin-right: auto;
            }
            .title .title-icon {
                @apply --layout-end;
            }
            .username {
                font-size: 16px;
                line-height: 18px;
                margin-bottom: 14px;
                color: var(--color-grey);
            }
            .username-text {
                color: var(--color-grey);
                font-weight: bold;
                padding-right: 5px;
            }
            .username-text:hover {
                color: var(--color-kano-orange);
            }
            iron-image {
                width: 100%;
                height: 100%;
            }
            #actions {
                display: flex;
                flex-direction: row;
            }
        </style>

        <div class="wrapper">
            <div class="cover">
                <slot name="cover"></slot>
                <img class="avatar" on-tap="_onTapAvatar" src="[[_avatar]]">
            </div>
            <div class="title" on-tap="_onTapTitle">
                <div class="title-text">[[title]]</div>
                <!-- If you want to mark this post with an icon (for example animation)
                you can slot it into this \`title-icon\` slot -->
                <div class="title-icon"><slot name="title-icon"></slot></div>
            </div>
            <div class="username" on-tap="_onTapUsername">
                by <span class="username-text"> [[username]]</span> [[_date]] ago
            </div>
            <div id="actions">
                <slot name="actions"></slot>
            </div>
            <div id="details">
                <slot name="details"></slot>
            </div>
        </div>
`,

  is: 'kwc-share-card',

  properties: {
      username: {
          type: String,
      },
      title: {
          type: String,
      },
      date: {
          type: String,
      },
      avatar: {
          type: Object,
      },
      /**
       * Image to fallback in case user doesn't have an avatar.
       * @type {String}
       */
      defaultAvatar: {
          type: String,
      },
      /**
       * Computed source (`src`) data for the avatar to be displayed.
       * @type {String}
       */
      _avatar: {
          type: String,
          computed: '_computeAvatar(avatar.urls.world, avatar.urls.circle)',
      },
      /**
       * Computed date for share creation
       * @type {String}
       */
      _date: {
          type: String,
          computed: '_convertDate(date)',
      }
  },

  /**
   * Computes which avatar source (`src`) to be used. If user has
   * an avatar use it, otherwise fallback to the `defaultAvatar`.
   * @param {String} avatar Share's creator avatar.
   * @return {String}
   */
  _computeAvatar(worldAvatar, circleAvatar) {
      if (worldAvatar) {
          return worldAvatar;
      } else if (circleAvatar) {
          return circleAvatar;
      } else {
          return this.defaultAvatar;
      }
  },

  /**
   * Fired when avatar is tapped
   *
   * @event avatar-tapped
   * @param {Object} user User who created the tapped avatar.
   */
  /**
   * Handles tap event on the avatar and fires `avatar-tapped`
   */
  _onTapAvatar() {
      this.fire('avatar-tapped');
  },

  /**
   * Handles tap event on the avatar and fires `avatar-tapped`
   */
  _onTapUsername() {
      this.fire('username-tapped');
  },

  /**
   * Fired when share title is tapped
   *
   * @event title-tapped
   */
  /**
   * Handles tap event on the title and fires `title-tapped`
   */
  _onTapTitle() {
      this.fire('title-tapped');
  },

  /**
  * Computes the day/time a share was created
  */
  _convertDate(dateCreated) {
      dateCreated = new Date(dateCreated);
      let dateNow = new Date(),
          dateDifference = dateNow - dateCreated,
          dateInSeconds = Math.floor(dateDifference / 1000),
          dateInMinutes = Math.floor(dateInSeconds / 60),
          dateInHours = Math.floor(dateInMinutes / 60),
          dateInDays = Math.floor(dateInHours / 24),
          dateInWeeks = Math.floor(dateInDays / 7),
          dateInMonths = Math.floor(dateInDays / 30),
          dateInYears = Math.floor(dateInDays / 365);
      if (dateInSeconds < 60) {
          return this.dateLabel(dateInSeconds, 'second');
      } else if (dateInMinutes < 60) {
          return this.dateLabel(dateInMinutes, 'minute');
      } else if (dateInHours < 24) {
          return this.dateLabel(dateInHours, 'hour');
      } else if (dateInDays < 7) {
          return this.dateLabel(dateInDays, 'day');
      } else if (dateInDays < 30) {
          return this.dateLabel(dateInWeeks, 'week');
      } else if (dateInDays > 30 && dateInDays < 365) {
          return this.dateLabel(dateInMonths, 'month');
      } else if (dateInDays > 365) {
          return this.dateLabel(dateInYears, 'year');
      }
  },

  dateLabel(dateInUnitTime, unit) {
    let label;
    label = dateInUnitTime + ` ${unit}`;
    dateInUnitTime === 1 ? label : label = label + 's';
    return label;
  }
});
