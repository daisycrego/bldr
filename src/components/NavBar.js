import React from 'react'; 

const NavBar = (props) => {
	const { userName, buttons, selectedButton, displayHistory } = props; 

	return (
		<div className="nav">
			
			{buttons.map((item, i) => {
				return <button 
					className={(item.name === selectedButton || (item.name === "history" && displayHistory)) ? "selected" : null} 
					key={i} 
					onClick={() => props.handleClick(item.name)}>
					{item.name ==="history" && displayHistory ? 'Hide ': ''}{item.text}
				</button>
			})}
			{
				<button onClick={() => props.toggleUser()}> by {userName} </button>
			}
		</div>
	);
};

export default NavBar;