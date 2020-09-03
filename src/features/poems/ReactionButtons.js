import React from 'react'
import { useDispatch } from 'react-redux'
import { reactionAdded } from './poemSlice'

const reactionEmoji = {
  1: '🥶',
  2: '😨',
  3: '😰',
  4: '😱',
  5: '🤯'
}


export const ReactionButtons = ({ poem }) => {
	const dispatch = useDispatch()

	if (!poem.reactions) {
		return null
	}

	const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
		return (
		  <button 
		  	key={name} 
		  	type="button" 
		  	className="muted-button reaction-button"
		  	onClick={ () => dispatch(reactionAdded({ poemId: poem.id, reaction: name })) }
		  >
		    	{emoji} {poem.reactions[name]}
		  </button>
		)
	})

  return <div>{reactionButtons}</div>
}