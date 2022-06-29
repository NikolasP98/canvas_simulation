# Flocking Simulator

For details on theory of how the mechanics of the simulator and the quadtree optimization, feel free to check out my [blog post](https://nikolaspro.notion.site/Flocking-Sim-Boids-b5fc42748e85477584709a751a0742b7) to see how they work.

[Demo](https://nikolasp98.github.io/interactive_flocking_simulation_with_quadtree_implementation/)

## Installation

To install and run the sim, run `yarn` or `npm` in the root folder.

After doing that, run `yarn dev` to initiate the dev server!

## Usage

Click on the screen to add a family of boids that will simulate flocking. The size of each boid determines the range of each of their parameters (bigger boid = more perception radius)

When running the simulator, adjust the **intensity** of each parameter (Alignment, Cohesion, and Separation). The checkboxes can be used to visualize the perception radii for every boid.

`Particle Size Rand.` will increase the randomness of the size of boids generated on each click (higher value adds more size variety)

`Perception Radius` globally adjusts the perception radii (when higher, boids become more aware of neighboring boids)

## Sources

-   [The Nature of Code](https://natureofcode.com) by Daniel Shiffman
-   [quadtree-js](https://github.com/timohausmann/quadtree-js) by timohausmann
    -   [Post by author](https://timohausmann.github.io/quadtree-js/simple.html)
-   [Examples by Mesh](https://github.com/mikechambers/ExamplesByMesh) by mikechambers
    -   [Post by author](http://www.mikechambers.com/blog/2011/03/21/javascript-quadtree-implementation/)

## Changelog

### 1.0.0

Added better QT implementation (self-coded) that can either handle points or bodies. More efficient results that

## To-Do

-   Revamp vector.js and add static methods that return new Vector objects (previous methods will adjust current Vector object, allowing method chaining!)
-   Implement Quadtree params in the controls menu
-   Make controls menu draggable
-   Make boids triangular for sense of direction
-   Adjust parameter values so that the sim runs more predictablity (smaller max radii, lower max speed, better proportional perception radii)
-   Port to reactjs? (better state management for controls)
