import React from 'react'; 

const NavBar = (props) => {
	const { buttonNames } = props; 

	/*const buttons = [];
	for(let key in navButtons) {
		buttons.
	}
	*/

	return (
		<div className="nav">
			{Object.keys(buttonNames).map((item, i) => {
				return <button 
					className={item === "history" ? "selected" : null} 
					key={i} 
					onClick={(e) => 
					props.handleClick(item)}>
					{buttonNames[item]}
				</button>
			})}
		</div>
	);
};

export default NavBar;