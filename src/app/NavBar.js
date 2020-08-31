import React from 'react'; 
import { Link } from 'react-router-dom';

const NavBar = () => {
	const user = "J"
	const buttons = [{name: "currentBuild", text: "Current Build", url:"/currentBuild"}, {name: "wordBank", text: "Word Bank", url: "/words"}, {name: "help", text: "Help", url: "/help"}, {name: "selfDestruct", text: "Self Destruct", url: "/relax"}, {name: "myPoems", text: "My Poems", url:"/history"}, {name: "user", text: "by J", url:"/user"} ]

	return (
		<div className="nav">
			{buttons.map((item, i) => {
				return <Link to={item.url}><button type="button" key={i}>{item.text}</button></Link>
			})}
		</div>
	);
};

export default NavBar;