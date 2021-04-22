import React from 'react';

function EditEpisode(props) {
    return (
        <div className="container text-white">
            <div className="row">
                <div className="col-lg-8 offset-lg-2">
                    <h5 className="mb-1">Movie: <b>Saigon In My Heart</b></h5>
                    <h3 className="mb-3">Edit Episode: <b>Episode #1</b></h3>
                    <form>
                        <div className="row">
                            <div className="col-md-3 mb-1">
                                <div className="form mb-4">
                                    <label className="form-label text-white font-weight-bold" for="id">ID</label>
                                    <input type="text" id="id" className="form-control border"/>
                                </div>
                            </div>
                            <div className="col-md-6 mb-1">
                                <div className="form mb-4">
                                    <label className="form-label text-white font-weight-bold" for="title">Title</label>
                                    <input type="text" id="title" className="form-control border"/>
                                </div>
                            </div>
                            <div className="col-md-3 mb-1">
                                <div className="form mb-4">
                                    <label className="form-label text-white font-weight-bold" for="duration">Duration</label>
                                    <input type="number" id="duration" className="form-control border" min="0" max="99999" value="0"/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-8 mb-1">
                                <div className="form mb-4">
                                    <label className="form-label text-white font-weight-bold" for="file-url">File URL</label>
                                    <input type="text" id="file-url" className="form-control border"/>
                                </div>
                            </div>
                            <div className="col-md-4 mb-1">
                                <div className="form mb-4">
                                    <label className="form-label text-white font-weight-bold" for="status">Status</label>
                                    <select id="status" className="form-select">
                                        <option value="0" selected>Required Processing</option>
                                        <option value="2">Ready</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-2 mb-2">
                                <button type="submit" className="btn btn-white btn-block"><i class="fas fa-arrow-circle-left me-1"></i>Back</button>
                            </div>
                            <div className="col-md-2 mb-2">
                                <button type="submit" className="btn btn-danger btn-block"><i class="fas fa-arrow-circle-left me-1"></i>Delete</button>
                            </div>
                            <div className="col-md-8 mb-2">
                                <button type="submit" className="btn btn-warning btn-block"><i class="fas fa-save me-1"></i>Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditEpisode;