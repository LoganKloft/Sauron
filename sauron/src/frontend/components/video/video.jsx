import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

import './video.scss'

/**
 * Used to hold on to references.
 */
let animationId, resizeObserver;

export const VideoJS = (props) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const { options, onReady, queryData } = props;

    useEffect(() => {
        // Make sure Video.js player is only initialized once
        if (!playerRef.current) {
            // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode. 
            const videoElement = document.createElement("video-js");
            videoElement.id = 'video';

            videoElement.classList.add('vjs-big-play-centered');
            videoRef.current.appendChild(videoElement);

            const player = playerRef.current = videojs(videoElement, options, () => {
                videojs.log('player is ready');
                onReady && onReady(player);
            });

        } else {
            const player = playerRef.current;
            player.autoplay(options.autoplay);
            player.src(options.sources);
        }

         // Dispose the Video.js player when the functional component unmounts
        return () => {
            if (playerRef.current && !playerRef.current.isDisposed()) {
                playerRef.current.dispose();
                playerRef.current = null;
            }
        };
    }, [options, videoRef]);

    /**
     * This function draws the boxes
     */
    const animate = () => {
        const time = playerRef.current.currentTime();
        const videoWidth = playerRef.current.videoWidth();
        const videoHeight = playerRef.current.videoHeight();

        /** @type {HTMLCanvasElement} */
        const canvas = document.getElementById('overlay');
        const ctx = canvas.getContext('2d')

        const width = canvas.width;
        const height = canvas.height;

        ctx.reset();
        ctx.scale(width / videoWidth, height / videoHeight);

        ctx.strokeStyle = 'rgb(181, 21, 21)';

        // Set the line width for the stroke
        ctx.lineWidth = 1;

        queryData.map((queryDataItem) => {
            const label = Object.keys(queryDataItem)[0]
            const item = queryDataItem[label]
            const timestamps = item.timestamps;

            // Get closest timestamp according to current time
            let closestIndex = -1, closestValue = null;
            for (let i = 0; i < timestamps.length; i++) {
                const distance = Math.abs(time - timestamps[i]);
                if (!closestValue || distance < closestValue) {
                    closestValue = distance;
                    closestIndex = i;
                }
            }

            // If the timestamp is within a second, draw the bounding box and text.
            if (closestValue < 1) {
                const frames = item.boxes[closestIndex]
                for (const frame of frames) {
                    ctx.strokeText(label, frame.x1 + 1, frame.y1 + 7);
                    ctx.strokeRect(frame.x1, frame.y1, frame.x2 - frame.x1, frame.y2 - frame.y1);
                }
            }
        })

        // Get the next animation frame
        animationId = window.requestAnimationFrame(animate);
    }

    useEffect(() => {
        // Setup a resize observer so the canvas can always be the size of its sibling div.
        const overlay = document.getElementById('overlay');
        animationId = window.requestAnimationFrame(animate);
        resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                overlay.width = entry.target.getBoundingClientRect().width;         
                overlay.height = entry.target.getBoundingClientRect().height;
            });
        });

        resizeObserver.observe(playerRef.current.contentEl());        
        return () => {
            // Stops the animation loop
            window.cancelAnimationFrame(animationId);
            resizeObserver.disconnect();
        }
    })
    
    return (
        <div data-vjs-player>
            <canvas id="overlay"/>
            <div ref={videoRef} />
        </div>
    );
}

export default VideoJS;