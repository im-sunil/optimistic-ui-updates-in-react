import React, { Component } from "react";
import "./index";
const deleteItemRequest = id => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      id === 3 ? reject() : resolve();
    }, 750);
  });
};
const initialState = {
  loading: false,
  error: null,
  items: Array.from(Array(5), (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`
  }))
};
const DeleteButton = props => (
  <button
    style={{ outline: "none" }}
    type="button"
    className="outline-none pull-right"
    onClick={id => props.deleteItem(id)}
  >
    <span className={`fa fa-trash text-danger `} />
  </button>
);
class App extends Component {
  state = initialState;
  deleteItem = async id => {
    const deletedItem = this.state.items.find(item => item.id === id);
    this.setState(state => ({
      items: state.items.filter(item => item.id !== id),
      error: null
    }));
    try {
      const deleted = await deleteItemRequest(id);
    } catch (error) {
      this.setState(state => ({
        items: [...state.items, deletedItem].sort((a, b) => a.id - b.id),
        error: `Request failed for id ${id}`
      }));
    }
  };
  render() {
    const { items, loading, error } = this.state;

    return (
      <div className="container">
        <h4 className="text-muted text-center lead pt-2">
          Optimistic UI update in React using <strong>setState()</strong>
        </h4>
        <ul className="list-group" style={{ opacity: loading ? 0.5 : 1 }}>
          {items.map(item => (
            <li className="list-group-item" key={item.id}>
              {item.title}{" "}
              <DeleteButton deleteItem={() => this.deleteItem(item.id)} />
            </li>
          ))}
        </ul>
        <span className="text-danger">{error}</span>
      </div>
    );
  }
}

export default App;
