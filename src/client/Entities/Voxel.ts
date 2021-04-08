import * as THREE from "three";
export class Voxel {
  private geometry: THREE.BoxBufferGeometry;
  private material: THREE.MeshLambertMaterial;

  constructor() {
    this.geometry = new THREE.BoxBufferGeometry(100, 100, 100);
    this.material = new THREE.MeshLambertMaterial({ color: 0xf3ffe2 });
  }

  addToScene(scene: THREE.Scene, x: number, y: number, z: number) {
    let mesh = new THREE.Mesh(this.geometry, this.material);
    mesh.position.set(x, y, z);
    scene.add(mesh);
  }
}
