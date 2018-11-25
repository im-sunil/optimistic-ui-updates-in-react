import React, { Component } from "react";

import "./index.css";

const shouldFails = id => [3, 4].includes(id);
const likeTweetRequest = (tweetId, like) => {
  console.log(`HTTP /like_twwet/${tweetId}?like=${like} (begin)`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldSucceed = !shouldFails(tweetId);
      console.log(
        `HTTP /like_twwet/${tweetId}?like=${like} (${
          shouldSucceed ? "success" : "failure"
        })`
      );
      shouldSucceed ? resolve() : reject();
    }, 1000);
  });
};
const initialWords = ["", "S", "R", "V", "M"];
const initialState = {
  tweets: [0, 3, 98, 0].map((likes, index) => ({
    id: index + 1,
    likes,
    username: `${shouldFails(index + 1) ? "Fail" : "Cool"}Cat${index + 1}`
  })),
  likedTweets: [2]
};

function Avatar({ initialWord }) {
  return (
    <img
      src={`https://via.placeholder.com/50.png/1975ca/fff?text= ${
        initialWords[initialWord]
      }`}
      className="avatar"
      alt="avatar"
    />
  );
}
function Message() {
  return <div className="message">This is less than 140 characters.</div>;
}
function NameWithHandle({ name }) {
  return (
    <span className="name-with-handle">
      <strong className="name">{name}</strong>
      <span className="handle">@{name}</span>
    </span>
  );
}
const Time = () => <span className="time">3h ago</span>;
const ReplyButton = () => (
  <button type="button" className="custom-btn">
    <i className="fa fa-reply reply-button" />
  </button>
);
const RetweetButton = () => (
  <button type="button" className="custom-btn">
    <i className="fa fa-retweet retweet-button" />
  </button>
);

const MoreOptionsButton = () => (
  <button type="button" className="custom-btn">
    <i className="fa fa-ellipsis-h more-options-button" />
  </button>
);

const LikeButton = ({ id, isLiked, handleClickLike, likes }) => (
  <button
    type="button"
    className="custom-btn"
    onClick={() => handleClickLike(id)}
  >
    <span
      className={`fa fa-heart like-button  ${isLiked ? "text-danger" : ""}`}
    />
    <span
      style={{
        fontSize: "0.9em"
      }}
      className="text-muted text-small"
    >
      {" "}
      {likes}
    </span>
  </button>
);

function Tweet(props) {
  return (
    <div className="tweet">
      <Avatar initialWord={props.id} />
      <div className="content">
        <NameWithHandle name={props.username} /> <Time />
        <Message />
        <div className="buttons">
          <ReplyButton />
          <RetweetButton />
          <LikeButton
            likes={props.likes}
            isLiked={props.isLiked}
            id={props.id}
            handleClickLike={tweetId => props.onClickLike(tweetId)}
          />
          <MoreOptionsButton />
        </div>
      </div>
    </div>
  );
}
const setTweetLiked = (tweetId, newLiked) => {
  return state => {
    return {
      tweets: state.tweets.map(tweet =>
        tweet.id === tweetId
          ? { ...tweet, likes: tweet.likes + (!newLiked ? -1 : 1) }
          : tweet
      ),
      likedTweets: !newLiked
        ? state.likedTweets.filter(id => id !== tweetId)
        : [...state.likedTweets, tweetId]
    };
  };
};
class App extends Component {
  state = initialState;
  likeRequestPending = false;
  onClickLike = async tweetId => {
    if (this.likeRequestPending) {
      console.log("likeRequestPending", this.likeRequestPending);
      return;
    }
    const isLiked = this.state.likedTweets.includes(tweetId);
    this.setState(setTweetLiked(tweetId, !isLiked));
    this.likeRequestPending = true;
    try {
      const tweet = await likeTweetRequest(tweetId, true);
      this.likeRequestPending = false;
    } catch (error) {
      this.setState(setTweetLiked(tweetId, isLiked));
      this.likeRequestPending = false;
      console.log("error");
    }
  };
  render() {
    const { tweets, likedTweets } = this.state;

    return (
      <div className="container">
        <h3 className="text-muted   lead pt-2">
          Optimistic ui updates with react
        </h3>
        <div className="list-group col">
          {tweets.map((tweet, index) => {
            return (
              <Tweet
                key={tweet.id}
                isLiked={likedTweets.includes(tweet.id)}
                onClickLike={this.onClickLike}
                {...tweet}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
