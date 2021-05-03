import { InitGPU, CreateGPUBuffer } from './helper';
import { Shaders } from './shaders';

const CreateSquare = async () => {
    const gpu = await InitGPU();
    const device = gpu.device;

    const vertexData = new Float32Array([
        //position    //color
       -0.5, -0.5,    1, 0, 0,
        0.5, -0.5,    0, 1, 0,
       -0.5,  0.5,    1, 1, 0,
       -0.5,  0.5,    1, 1, 0,
        0.5, -0.5,    0, 1, 0,
        0.5,  0.5,    0, 0, 1
   ]);

    const vertexBuffer = CreateGPUBuffer(device, vertexData);
    
    const shader = Shaders();
    const pipeline = device.createRenderPipeline({
        vertex: {
            module: device.createShaderModule({                    
                code: shader.vertex
            }),
            entryPoint: "main",
            buffers:[
                {
                    arrayStride: 4*(2+3),
                    attributes: [{
                        shaderLocation: 0,
                        format: "float32x2",
                        offset: 0
                    },
                    {
                        shaderLocation: 1,
                        offset: 4*2,
                        format: 'float32x3'
                    }
                    ]
                }
            ]
        },
        fragment: {
            module: device.createShaderModule({                    
                code: shader.fragment
            }),
            entryPoint: "main",
            targets: [
                {
                    format: gpu.swapChainFormat as GPUTextureFormat
                }
            ]
        },
        primitive:{
            topology: "triangle-list",
        }
    });

    const commandEncoder = device.createCommandEncoder();
    const textureView = gpu.swapChain.getCurrentTexture().createView();
    const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
            view: textureView,
            loadValue: { r: 0.5, g: 0.5, b: 0.8, a: 1.0 }, //background color
            storeOp: 'store'
        }]
    });
    renderPass.setPipeline(pipeline);
    renderPass.setVertexBuffer(0, vertexBuffer);
    renderPass.draw(6);
    renderPass.endPass();

    device.queue.submit([commandEncoder.finish()]);
}

CreateSquare();




