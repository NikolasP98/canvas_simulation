# Flocking Simulator

For details on theory of how the mechanics of the simulator and the quadtree optimization, feel free to check out my [blog post](https://nikolaspro.notion.site/Flocking-Sim-Boids-b5fc42748e85477584709a751a0742b7) to see how they work.

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
-   [Examples by Mesh](https://github.com/mikechambers/ExamplesByMesh) by mikechambers
