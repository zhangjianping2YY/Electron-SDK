{
    'target_defaults': {
        'default_configuration': 'Release'
    },
    'targets': [
    {
        'target_name': 'agora_mediaplayer_node_ext',
        'include_dirs': [
        './common',
        "<!(node -e \"require('nan')\")"
        ],
        'sources': [
        './common/node_log.cpp',
        './common/node_log.h',
        './common/node_process.h',
        './common/loguru.hpp',
        './common/loguru.cpp',
        './agora_node_ext/agora_node_ext.cpp',
        './agora_node_ext/agora_node_ext.h',
        './agora_node_ext/node_async_queue.cpp',
        './agora_node_ext/node_async_queue.h',
        './agora_node_ext/node_napi_api.cpp',
        './agora_node_ext/node_napi_api.h',
        './agora_node_ext/agora_media_player.h',
        './agora_node_ext/agora_media_player.cpp',
        './agora_node_ext/node_media_player_observer.h',
        './agora_node_ext/node_media_player_observer.cpp',
        './agora_node_ext/node_media_player_video_frame_observer.h',
        './agora_node_ext/node_media_player_video_frame_observer.cpp'
        ],
        'conditions': [
            [
            'OS=="win"',
            {
                'copies': [{
                    'destination': '<(PRODUCT_DIR)',
                    'files': [
                        './sdk/media_player/win/dll/AgoraMediaPlayer.dll'
                    ]
                }],
                'library_dirs': [
                    './sdk/media_player/win/lib'
                ],
                'link_settings': {
                    'libraries': [
                        '-lws2_32.lib',
                        '-lRpcrt4.lib',
						'-lgdiplus.lib',
                        '-lAgoraMediaPlayer.lib'
                    ]
                },
                'defines!': [
                '_USING_V110_SDK71_',
                '_HAS_EXCEPTIONS=0'
                ],
                'sources': [
                    './common/node_process_win.cpp'
                ],
                'include_dirs': [
                './sdk/media_player/win/include'
                ],
                'configurations': {
                    'Release': {
                        'msvs_settings': {
                            'VCCLCompilerTool': {
                                'ExceptionHandling': '0',
                                'AdditionalOptions': [
                                    '/EHsc'
                                ]
                            }
                        }
                    },
                    'Debug': {
                        'msvs_settings': {
                            'VCCLCompilerTool': {
                                'ExceptionHandling': '0',
                                'AdditionalOptions': [
                                    '/EHsc'
                                ]
                            }
                        }
                    }
                }
            }
            ],
            [
            'OS=="mac"',
            {
                'mac_framework_dirs': [
                '../sdk/lib/media_player'
                ],
                'copies': [{
                    'destination': '<(PRODUCT_DIR)',
                    'files': [
                        './sdk/lib/media_player/AgoraMediaPlayer.framework'
                    ]
                }],
                'link_settings': {
                    'libraries': [
                    'libresolv.9.dylib',
                    'Accelerate.framework',
                    'CoreWLAN.framework',
                    'Cocoa.framework',
                    'VideoToolbox.framework',
                    'SystemConfiguration.framework',
                    'IOKit.framework',
                    'CoreVideo.framework',
                    'CoreMedia.framework',
                    'OpenGL.framework',
                    'CoreGraphics.framework',
                    'CFNetwork.framework',
                    'AudioToolbox.framework',
                    'CoreAudio.framework',
                    'Foundation.framework',
                    'AVFoundation.framework',
                    'AgoraMediaPlayer.framework'
                    ]
                },
                'sources': [
                    './common/node_process_unix.cpp'
                ],
                'include_dirs': [
                './sdk/lib/media_player/AgoraMediaPlayer.framework/Headers'
                ],
                'defines!': [
                    '_NOEXCEPT',
                    '-std=c++11'
                ],
                'OTHER_CFLAGS' : [
                    '-std=c++11',
                    '-stdlib=libc++',
                    '-fexceptions'
                ],
                'xcode_settings': {
                    'MACOSX_DEPLOYMENT_TARGET': '10.11',
                    'EXECUTABLE_EXTENSION': 'node',
                    'FRAMEWORK_SEARCH_PATHS': [
                    './sdk/lib/media_player'
                    ],
                    "DEBUG_INFORMATION_FORMAT": "dwarf-with-dsym"
                },
            }
            ]
        ]
    },
    ]
}
